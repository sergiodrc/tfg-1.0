import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formRegister: FormGroup;
  formLogin: FormGroup;
  isRegistred: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar

  ) {
    this.formRegister = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nickname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
    });
    this.formLogin = this.fb.group({
      correo: ['admin@gmail.com', Validators.required],
      password: ['root', [Validators.required]],
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duración del snackbar en milisegundos
    });
  }

  ngOnInit(): void {}

  async registerUser() {
    var nombre = this.formRegister.get('nombre')?.value;
    var apellido = this.formRegister.get('apellido')?.value;
    var nickname = this.formRegister.get('nickname')?.value;
    var password = this.formRegister.get('password')?.value;
    var correo = this.formRegister.get('correo')?.value;

    const userData = {
      nombre: nombre,
      apellido: apellido,
      nickname: nickname,
      password: password,
      correo: correo,
    };


    // Guardar el objeto sin la contraseña en el localStorage
    localStorage.setItem('correo', userData.correo);
    localStorage.setItem('nickname', userData.nickname);
    try {
      // Realizar la solicitud POST a la API y obtener el primer valor emitido
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:9002/user/register', userData)
      );
      
      if (response.status) {
        console.log('Respuesta exitosa:', response);
       
        this.isRegistred = true;
        // Redirigir a la página de inicio después del registro exitoso
        this.router.navigate(['/home']);
      }
      
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error al registrar usuario:', error);
      // Aquí puedes mostrar un mensaje de error al usuario u otra acción de manejo de errores
    }
  }

  async loginUser() {
    const password = this.formLogin.get('password')?.value;
    const correo = this.formLogin.get('correo')?.value;
      

    const userData = {
      correo: correo,
      password: password,
      //nickname: nickname
    };

    localStorage.setItem('correo', correo);
    //localStorage.setItem('nickname', userData.nickname);
    try {
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:9002/user/login', userData)
      );
      console.log(userData)
      // console.log('Respuesta del servidor:', response);
      console.log('userData: ', userData);
      console.log('Respuesta :', response);

      if (response.status) {
        console.log('Usuario logeado correctamente');
        this.isRegistred = true;
        try {
        } catch(err) {
console.log(err)
        }

        this.router.navigate(['/home']);
      } else {
        this.openSnackBar('Datos incorrectos', 'Cerrar');
       
      }
    } catch (error) {
      console.error('Error al logear usuario:', error);
    }
  }
}
