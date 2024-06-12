import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Publication {
  _id: string;
  user: string;
  archivo_publicacion: string;
  texto_publicacion: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  fileToUpload: File | null = null;
  publications: Publication[] = [];
  @ViewChild('addCommentMod') addCommentMod = {} as TemplateRef<string>;
  @ViewChild('addPub') addPub = {} as TemplateRef<string>;
  commentData: any;
  dialogComment: any;
  dialogAdd: any;
  createPubForm: FormGroup;
  selectedOption: string = '1';

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.createPubForm = this.fb.group({
      archivo_publicacion: [''],
      texto_publicacion: ['', Validators.required],
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duración del snackbar en milisegundos
    });
  }

  ngOnInit(): void {
    this.getAllPublications();
  }

  user = localStorage.getItem('correo');

  createPub() {
    const email = localStorage.getItem('correo');
    console.log(email);
    if (!email) {
      console.error('No email found in localStorage');
      return;
    }
    if (!this.fileToUpload || !this.createPubForm.valid) {
      console.error('Form is not valid or no file selected');
      return;
    }

    const url = 'http://localhost:9002/publications/createPublication';
    const formData: FormData = new FormData();

    // Append file
    formData.append('archivo_publicacion', this.fileToUpload, this.fileToUpload.name);
    // Append other form data
    formData.append('texto_publicacion', this.createPubForm.value.texto_publicacion);
    formData.append('user', email);

    console.log('FormData content:', formData);

    this.http.post(url, formData).subscribe(
      (response) => {
        console.log('Solicitud POST exitosa', response);
        this.getAllPublications();
        this.closeCreateModal();
        this.openSnackBar('Publicación creada', 'Cerrar'); 
      },
      (error) => {
        console.error('Error al realizar la solicitud POST', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      console.log('Selected file:', file);
    }
  }

  deletePub(pubId: string): void {
    console.log(pubId);
    this.http.request<any>('delete', `http://localhost:9002/publications/deletePublication/${pubId}`, {
    }).subscribe(response => {
      console.log(response);
      if (response.status) {
        console.log('Partida eliminada correctamente');
        this.selectedOption = '1';
        this.openSnackBar('Publicación eliminada', 'Cerrar');
            } else {
        console.error('Error al eliminar la partida:', response.message);
      }
    }, error => {
      console.error('Error al comunicarse con el servidor:', error);
    });
  }

  getAllPublications(): void {
    this.selectedOption = '1';
    const url = 'http://localhost:9002/publications/getAllPublications';
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response);
        if (response.status) {
          this.publications = response.publications.map((pub: any) => ({
            user: pub.user,
            texto_publicacion: pub.texto_publicacion,
            _id: pub._id,
            archivo_publicacion: `http://localhost:9002/uploads/${pub.archivo_publicacion}`,
          }));
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.log(error);
        console.error('Error retrieving messages:', error);
      }
    );
  }

  getMyPublications(): void {
    this.selectedOption = '2';
    const email = localStorage.getItem('correo');
    const url = `http://localhost:9002/publications/getMyPublications/${email}`;
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response);
        if (response.status) {
          this.publications = response.publications.map((pub: any) => ({
            user: pub.user,
            texto_publicacion: pub.texto_publicacion,
            _id: pub._id,
            archivo_publicacion: `http://localhost:9002/uploads/${pub.archivo_publicacion}`
          }));
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.log(error);
        console.error('Error retrieving messages:', error);
      }
    );
  }

  openAddPubModal() {
    this.dialogAdd = this.dialog.open(this.addPub, {
      width: '35rem',
      height: '20rem',
      disableClose: true
    });
  }

  closeCreateModal() {
    this.dialogAdd.close();
  }

  onOptionChange(): void {
    if (this.selectedOption === '1') {
      this.getAllPublications(); // Si se selecciona 'Todas las partidas', obtener partidas generales
    } else if (this.selectedOption === '2') {
      this.getMyPublications(); // Si se selecciona 'Tus partidas', obtener tus partidas
    }
  }
}
