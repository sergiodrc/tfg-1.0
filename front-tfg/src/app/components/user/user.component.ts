import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
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
  userData: any;

  @ViewChild('deleteUserMod') deleteUserMod = {} as TemplateRef<string>;
  detailData: any;
  dialogDel: any;



  constructor(private fb: FormBuilder, private dialog: MatDialog, private http: HttpClient, private router: Router ) {
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
    this.getUserDetail();
  }


  editInfo(){
    this.showInfo=false
  }

  async deleteUser() {
    const correo = localStorage.getItem('correo');
  
    if (!correo) {
      console.error('No se encontró el correo en el localStorage.');
      return;
    }
  
    const userData = { correo: correo };
  
    try {
      const response: any = await firstValueFrom(this.http.request('delete', 'http://localhost:9002/user/deleteUser', { 
        body: userData
      }));
     
  
      if (response.status) {
        console.log('Usuario eliminado correctamente');
        this.dialogDel.close();
        localStorage.removeItem('correo');
        this.router.navigate(['']);
      } else {
        console.error('Error al eliminar usuario:', response.msg);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }
  

  updateUserData(): void {
    const userEmail = localStorage.getItem('correo');
    if (!userEmail) {
      console.error('No se encontró el correo electrónico del usuario en el localStorage');
      return;
    }
  
    this.editForm.patchValue({ email: userEmail });
  
    if (this.editForm.valid) {
      const formData = {
        nombre_usuario: this.editForm.get('name')?.value,
        apellido_usuario: this.editForm.get('surname')?.value,
        nickname_usuario: this.editForm.get('nickname')?.value,
        email_usuario: userEmail, 
        tlf_usuario: this.editForm.get('phone')?.value
      };
  
      console.log('Datos a enviar:', formData);
  
      this.http.patch(`http://localhost:9002/user/updateUser/${userEmail}`, formData) 
        .subscribe((response: any) => {
          console.log('Respuesta del servidor:', response);
  
          if (response.status) {
            console.log('¡Datos actualizados correctamente!');
            this.getUserDetail();//volver a cargar los datos del usuario para actualizarlos 
          } else {
            console.error('¡Error al actualizar los datos!');
          }
        }, error => {
          console.error('Error en la solicitud:', error);
        });
    } else {
      console.error('Formulario no válido');
    }
  }
  
//mostrar los datos del usuario logeado
getUserDetail() {
    const correo = localStorage.getItem('correo');
    if (correo) {
        this.http.get<any>(`http://localhost:9002/userDetails/${correo}`).subscribe(data => {
            this.userData = data;
            this.showInfo = true;
        }, error => {
            console.log(error);
            // Manejar errores aquí
        });
    } else {
        console.error("No se encontró el correo  en el localStorage");
        // Manejar el caso en el que no se encuentra el correo electrónico en el localStorage
    }
}
  selectedFile: any = null;
  // para seleccionar imagen, tal vez deberia haber unas imagenes predefinidas en la bbdd y 
  // el usuario puede elegir entre esas
onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
}



//modal confirmar eliminacion usuario

openConfirmDelete() {
  this.dialogDel = this.dialog.open(this.deleteUserMod, {
    width: '27rem',
    height: '20rem',
  });
}

}
