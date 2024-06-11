import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @ViewChild('addCommentMod') addCommentMod = {} as TemplateRef<string>;
  @ViewChild('addPub') addPub = {} as TemplateRef<string>;
  commentData: any;
  dialogComment: any;
  dialogAdd: any;
  createPubForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { 
    this.createPubForm = this.fb.group({
      user: [this.user],
      archivo_publicacion: [''],
      texto_publicacion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }
  user = localStorage.getItem('correo');
  createPub() {
    
    const url = 'http://localhost:9002/publications/createPublication';
    const requestBody = this.createPubForm.value;
    console.log(requestBody)

    this.http.post(url, requestBody)
      .subscribe(
        (response) => {
          console.log('Solicitud POST exitosa', response);
          // Aquí puedes manejar la respuesta como desees
        },
        (error) => {
          console.error('Error al realizar la solicitud POST', error);
          // Aquí puedes manejar el error como desees
        }
      );
  }

  onFileSelected(event: any) {
    const correo = localStorage.getItem('correo');
    if (correo) {
      const file: File = event.target.files[0];
      const formData: FormData = new FormData();
      formData.append('img_usuario', file, file.name);
      formData.append('email_usuario', correo);
      console.log('--> Correo:', correo);
      console.log('Archivo:', file);
      console.log('------->', formData);
    }
  }



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
}
