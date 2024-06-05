import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  router: any;
  formRegister: FormGroup;
  formLogin: FormGroup;
  isRegistred: boolean = false;

  
  constructor(private fb: FormBuilder) {
    this.formRegister = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nickname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
    });
    this.formLogin = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });



  }

  ngOnInit(): void {}
<<<<<<< HEAD
}
=======
}
>>>>>>> front-delRio
