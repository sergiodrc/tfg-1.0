import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

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
    private router: Router
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
      password: ['patata', [Validators.required]],
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
    const userDataWithoutPassword = { ...userData };
    delete userDataWithoutPassword.password;

    // Guardar el objeto sin la contraseña en el localStorage
    localStorage.setItem('userData', JSON.stringify(userDataWithoutPassword));
    try {
      // Realizar la solicitud POST a la API y obtener el primer valor emitido
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:9002/user/register', userData)
      );
      if (response.status) {
        console.log('Respuesta exitosa:', response);
        console.log('esto se envia', userData);
        this.isRegistred = true;
        // Redirigir a la página de inicio después del registro exitoso
        this.router.navigate(['/home']);
      }
      // Manejar la respuesta exitosa de la API
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
    };

    localStorage.setItem('correo', correo);
    try {
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:9002/user/login', userData)
      );
      // console.log('Respuesta del servidor:', response);
      console.log('userData: ', userData);
      console.log('Respuesta :', response);

      if (response.status) {
        console.log('Usuario logeado correctamente');
        this.isRegistred = true;
        this.router.navigate(['/home']);
      } else {
        console.error('Error al logear usuario:', response.msg);
      }
    } catch (error) {
      console.error('Error al logear usuario:', error);
    }
  }
}
