import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Message {
  _id: string,
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
 
  visibleMessages: any[] = [];
  currentIndex = 0;
  itemsPerPage = 5;
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
    private snackBar: MatSnackBar

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
   

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duración del snackbar en milisegundos
    });
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
          this.openSnackBar('Mensaje enviado', 'Cerrar'); 
          
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
  this.selectedOption = '1'; //setea valor 1 al checkbox
  const email = localStorage.getItem('correo');
  if (!email) {
    console.error('Email not found in localStorage');
    return;
  }

  const url = `http://localhost:9002/my-messages/${email}`;

  this.http.get<any>(url).subscribe(
    response => {
      console.log(response)
      if (response.status) {
        this.messages = response.messages.map((msg: any) => ({
          _id: msg._id,
          emitter: msg.emitter,
          body: msg.texto_mensaje,
          receiver: msg.receiver
        }));
        this.loadMore();
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

loadMore(): void {
  const nextIndex = this.currentIndex + this.itemsPerPage;
  this.visibleMessages.push(...this.messages.slice(this.currentIndex, nextIndex));
  this.currentIndex = nextIndex;
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
          _id: msg._id,
          emitter: msg.emitter, 
          body: msg.texto_mensaje,
          receiver: msg.receiver
        }));
        console.log(this.messages)
      } else {
        console.error('No messages'/* response.message */);
      }
    },
    error => {
      console.log('Error -> ', error)
      console.error('Error retrieving messages:', error);
    }
  );
}
deleteMessage(messageId: string): void {
  console.log(messageId)

  this.http.request<any>('delete', `http://localhost:9002/messages/deleteMessage/${messageId}`, {
    //body: { _id: this.messages }
  }).subscribe(response => {
    if (response.status) {
      console.log('Mensaje eliminado correctamente');
      this.openSnackBar('Mensaje eliminado', 'Cerrar'); 

    } else {
      console.error('Error al eliminar la partida:', response.message);
    }
  }, error => {
    console.error('Error al comunicarse con el servidor:', error);
  });
  this.selectedOption = '1'; 
}

  // abrir y cerrar modales
  openDeleteModal(messageId: string): void {
    console.log('ID del mensaje a eliminar:', messageId);
    this.detailData = messageId;
    this.dialogDelete = this.dialog.open(this.deleteModal, {
      width: '25rem',
      height: '15rem',
      disableClose: true
    });
  }

  // Método para confirmar la eliminación
  confirmDelete(): void {
    if (this.detailData) {
      this.deleteMessage(this.detailData);
      this.dialogDelete.close();
    } else {
      console.error('No hay mensaje seleccionado para eliminar.');
    }
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