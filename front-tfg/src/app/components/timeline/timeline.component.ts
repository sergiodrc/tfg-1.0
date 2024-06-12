import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';


interface Publication {
  _id: string
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
    private router: Router
  ) { 
    this.createPubForm = this.fb.group({
      archivo_publicacion: [''],
      texto_publicacion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllPublications();
  }
  user = localStorage.getItem('correo');
  createPub() {
    const email = localStorage.getItem('correo');
    console.log(email)
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
    formData.append('user',email)

    console.log('FormData content:', formData);

    this.http.post(url, formData).subscribe(
      (response) => {
        console.log('Solicitud POST exitosa', response);
      },
      (error) => {
        console.error('Error al realizar la solicitud POST', error);
      }
    );
  };

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      console.log('Selected file:', file);
    }
  }
  //NO FUNCIONA
  deletePub(pubId: string): void {
    console.log(pubId)
    this.http.request<any>('delete', `http://localhost:9002/publications/deletePublication/${pubId}`, {
    }).subscribe(response => {
      console.log(response)
      if (response.status) {
        console.log('Partida eliminada correctamente');
        this.selectedOption = '1';
        // Actualiza la tabla eliminando el registro correspondiente
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
        console.log(response)
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
        console.log(error)
        console.error('Error retrieving messages:', error);
      }
    );
  }

  getMyPublications(): void {
    this.selectedOption = '2';
    const email = localStorage.getItem('correo');
    console.log('hola')
    const url = `http://localhost:9002/publications/getMyPublications/${email}`;
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response)
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
        console.log(error)
        console.error('Error retrieving messages:', error);
      }
    );
  }

 /*  getMyMatches(): void {
    const correo = localStorage.getItem('correo');
  
    if (!correo) {
      console.error('Correo no encontrado en localStorage');
      return;
    }
  
    const params = new HttpParams().set('correo', correo);
  
    this.http.get<any>('http://localhost:9002/publications/getMyPublications/', { params })
      .subscribe(
        response => {
          console.log('Partidas obtenidas propias:', response);
          if (response.status) {
            console.log('Tus partidas:', response.message);
            this.dataSource.data = response.matches;
          } else {
            console.error('Error al obtener tus partidas:', response.message);
          }
        },
        error => {
          console.error('Error al comunicarse con el servidor:', error);
        }
      );
  } */


  openCommentModal(element: any) {
    this.commentData = element;
    this.dialogComment = this.dialog.open(this.addCommentMod, {
      width: '45rem',
      height: '30rem',
      disableClose: true
    });
  }

  openAddPubModal() {
    this.dialogAdd = this.dialog.open(this.addPub, {
      width: '35rem',
      height: '20rem',
      disableClose: true
    });
  }

  closeCommentModal() {
    this.dialogComment.close();
  }

  onOptionChange(): void {
    if (this.selectedOption === '1') {
      this.getAllPublications(); // Si se selecciona 'Todas las partidas', obtener partidas generales
    } else if (this.selectedOption === '2') {
    this.getMyPublications(); // Si se selecciona 'Tus partidas', obtener tus partidas
    }
    }
}
