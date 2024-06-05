import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  router: any;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      nombre_usuario: ['', Validators.required],
      apellido_usuario: ['', Validators.required],
      email_usuario: ['', [Validators.required, Validators.email]],
      nickname_usuario: ['', Validators.required],
      contraseña_usuario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }



  register() {
    if (this.registerForm.valid) {
      const bodyData = this.registerForm.value;

      this.http.post('your-api-endpoint-url', bodyData).subscribe(response => {
        console.log(response);
      });
    }
  }

}
