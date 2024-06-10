import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Message {
  emitter: string;
  body: string;
  receiver: string;
  texto_mensaje?: string;
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
  selectedOption: string = '1';
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
    this.getMyMessages();
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
//mostrar mensajes user logeado
getMyMessages() {
  const email = localStorage.getItem('correo');
  if (!email) {
    console.error('Email not found in localStorage');
    return;
  }

  const url = `http://localhost:9002/my-messages/${email}`;

  this.http.get<any>(url).subscribe(
    response => {
      if (response.status) {
        this.messages = response.messages.map((msg: any) => ({
          emitter: msg.emitter,
          body: msg.texto_mensaje,
          receiver: msg.receiver
        }));
      } else {
        console.error(response.message);
      }
    },
    error => {
      console.error('Error retrieving messages:', error);
    }
  );
}

//devolver mensajes ENVIADOS
getMySentMessages() {
  const email = localStorage.getItem('correo');
  if (!email) {
    console.error('Email not found in localStorage');
    return;
  }

  const url = `http://localhost:9002/sentMessages/${email}`;

  this.http.get<any>(url).subscribe(
    response => {
      if (response.status) {
        console.log(response)
        this.messages = response.messages.map((msg: any) => ({
          emitter: msg.emitter, // Change to emitter
          body: msg.texto_mensaje,
          receiver: msg.receiver
        }));
      } else {
        console.error(response.message);
      }
    },
    error => {
      console.error('Error retrieving messages:', error);
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
/*manejar checkbox
1-->mensajes recibidos
2-->mensajes enviados
*/
  onOptionChange(): void {
    if (this.selectedOption === '1') {
      this.getMyMessages();
    } else if (this.selectedOption === '2') {
      this.getMySentMessages();
    }
  }
  

}
