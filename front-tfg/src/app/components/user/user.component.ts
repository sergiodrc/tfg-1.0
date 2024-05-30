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
}
