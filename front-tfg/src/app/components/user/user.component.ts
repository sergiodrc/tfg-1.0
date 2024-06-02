import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm:FormGroup;
  editForm:FormGroup;
  showInfo:boolean=true;

  constructor(public fb: FormBuilder ) {
    this.userForm = this.fb.group({
      name:[''],
      surname:[''],
      nickname:[''],
      email:[''],
      phone:[''],
    })
    this.editForm = this.fb.group({
      name:[''],
      surname:[''],
      nickname:[''],
      email:[''],
      phone:[''],
    })




  }

  ngOnInit(): void {
  }


  editInfo(){
    this.showInfo=false
  }


  selectedFile: any = null;


  // para seleccionar imagen, tal vez deberia haber unas imagenes predefinidas en la bbdd y 
  // el usuario puede elegir entre esas
onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;

}
}
