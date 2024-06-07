import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Message {
  emitter: string;
  body: string;
  receiver: string;
}
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})


export class MessagesComponent implements OnInit {
  detailData: any;
  dialogDelete: any;
  dialogReply:any;
  dialogConfirmDelete:any;
  dialogConfirmReply:any;
  dialogCreate:any;
  dialogConfirm:any;
  messageForm: FormGroup;
  newMsgForm: FormGroup;
  element:any  
  messages: Message[] = []

  @ViewChild('deleteModal') deleteModal = {} as TemplateRef<string>; 
  @ViewChild('createModal') createModal = {} as TemplateRef<string>; 
  @ViewChild('confirmSendMod') confirmSendMod = {} as TemplateRef<string>; 
  @ViewChild('replyMod') replyMod = {} as TemplateRef<string>;
  @ViewChild('confirmDeleteMod') confirmDeleteMod = {} as TemplateRef<string>;
  @ViewChild('confirmReplyMod') confirmReplyMod = {} as TemplateRef<string>;
  
  constructor(    
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,

  ) {
    // formulario para responder mensajes
    this.messageForm= this.fb.group({
      receiver:['', Validators.required],
      msgBody:['', Validators.required]
    })

    // formulario para mandar mensajes
    this.newMsgForm= this.fb.group({
      receiver:['', Validators.required],
      msgBody:['', Validators.required]
    })
  }
   
  ngOnInit(): void {
    //cargar los mensajes al entrar en la seccion mensajes
    this.loadMessages();
  }

//mostrar mensajes
  loadMessages() {
   //aqui la llamada que devuelva los mensajes
   //sustituir  ese objeto por lo que devuelva la api
    this.messages = [
      {
        emitter: "Usuario emisor 1",
        body: "Hola, ¿cómo estás?",
        receiver: "Usuario receptor 2"
      },
      {
        emitter: "Usuario emisor 1",
        body: "Mensaje de prueba",
        receiver: "Usuario receptor 2"
      },
    
    ];
  }

  // envio de mensajes
  sendMessage() {
    const emitter = localStorage.getItem('correo'); // Obtener el correo del emisor del Local Storage

    const messageDetails = {
      texto_mensaje: this.newMsgForm.value.msgBody,
      emitter: emitter,
      receiver: this.newMsgForm.value.receiver
    };

    this.http.post<any>('http://localhost:9002/message', messageDetails).subscribe(
      result => {
        if (result.status) {
          console.log('Mensaje enviado:', result.message);
          // Limpiar el formulario después de enviar el mensaje
          
          this.newMsgForm.reset();
          setTimeout(() => { //para que no sea tan brusco, de efecto de una transicion
            this.openConfirmSendMod(this.element)
          }, 100);
        } else {
          console.error('Error al enviar el mensaje:', result.message);
        }
      },
      error => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
  }




  // abrir y cerrar modales
  openDeleteModal(element: any) {
    this.detailData = element;
    this.dialogDelete = this.dialog.open(this.deleteModal, {
      width: '25rem',
      height: '15rem',
      disableClose:true
    });
  }
  openConfirmDeleteMod(element:any){
    this.detailData = element;
    this.dialogConfirmDelete = this.dialog.open(this.confirmDeleteMod, 
      {
      width: '30rem',
      height: '23rem',
      disableClose:true
    });
  }
  openReplyModal(element: any) {
    this.detailData = element;
    this.dialogReply = this.dialog.open(this.replyMod, {
      width: '40rem',
      height: '25rem',
      disableClose:true
    });
  }
  openConfirmSendMod(element: any) {
    this.detailData = element;
    this.dialogConfirm = this.dialog.open(this.confirmSendMod, {
      width: '40rem',
      height: '25rem',
      disableClose:true
    });
    this.dialogCreate.close();
  }
  openCreateModal(element: any) {
    this.detailData = element;
    this.dialogCreate = this.dialog.open(this.createModal, {
      width: '40rem',
      height: '25rem',
      disableClose:true
    });
  }
  openConfirmReplyMod(element: any) {
    this.detailData = element;
    this.dialogConfirmReply = this.dialog.open(this.confirmReplyMod, {
      width: '30rem',
      height: '25rem',
      disableClose:true
    });
  }

 
  

}
