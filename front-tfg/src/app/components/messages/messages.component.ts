import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 



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
  messageForm: FormGroup;
  element:any  
  @ViewChild('deleteModal') deleteModal = {} as TemplateRef<string>; 
  @ViewChild('replyMod') replyMod = {} as TemplateRef<string>;
  @ViewChild('confirmDeleteMod') confirmDeleteMod = {} as TemplateRef<string>;
  @ViewChild('confirmReplyMod') confirmReplyMod = {} as TemplateRef<string>;
  
  constructor(    
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    // formularios
    this.messageForm= this.fb.group({
      receiver:['', Validators.required],
      msgBody:['', Validators.required]
    })
   }

  ngOnInit(): void {
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
  openConfirmReplyMod(element: any) {
    this.detailData = element;
    this.dialogConfirmReply = this.dialog.open(this.confirmReplyMod, {
      width: '30rem',
      height: '25rem',
      disableClose:true
    });
  }

  closeDeleteModal(){
    this.dialogDelete.close();
  }
  closeReplyModal(){
    this.dialogReply.close();
  }

 
  closeDialogConfirmDelete(){
    this.dialogConfirmDelete.close();
    this.closeDeleteModal()
  }
  closeConfirmReplyModal(){
    this.dialogConfirmReply.close();
    this.closeReplyModal()
  }
  
  

}
