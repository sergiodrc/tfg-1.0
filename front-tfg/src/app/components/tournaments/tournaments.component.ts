import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

var moment = require('moment');

export interface Tournaments {
  _id: string; // Agrega el campo _id
  fecha_partida: string;
  puntuacion_maxima_partida: number;
  puntuacion_minima_partida: number;
  creador_partida: string;
  contrincante_partida: string;
}

interface DeleteMatchResponse {
  status: boolean;
  message: string;
}

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  addGameForm: FormGroup;
  modifyMatchForm: FormGroup;
  displayedColumns = ['date', 'maxScore', 'minScore', 'creator', 'actions'];
  dataSource = new MatTableDataSource<Tournaments>([]);
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('addGameModal') addGameModal = {} as TemplateRef<string>;
  @ViewChild('modifyMatchMod') modifyMatchMod = {} as TemplateRef<string>;
  @ViewChild('deleteMatchMod') deleteMatchMod = {} as TemplateRef<string>;
  detailData: any;
  dialogRef: any;
  selectedOption: string = '1';
  correo: string | null = null; // Correo del usuario almacenado en localStorage
  dialogDel: any;
  showDeleteIcons = false;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar

  ) {
    this.addGameForm = this.fb.group({
      date: ['', Validators.required],
      puntMax:['', Validators.required],
      puntMin:['', Validators.required],
    });
 
    this.modifyMatchForm = this.fb.group({
      puntMax: ['', Validators.required],
      puntMin: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duración del snackbar en milisegundos
    });
  }

  ngOnInit(): void {
    this.correo = localStorage.getItem('correo');
    this.showMatches();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  // Crear partida
  onSubmit() {
    if (this.addGameForm.valid) {
      const matchDetails = {
        fecha_partida: this.addGameForm.value.date,
        puntuacion_maxima_partida: this.addGameForm.value.puntMax,
        puntuacion_minima_partida: this.addGameForm.value.puntMin,
        creador_partida: this.correo || ''
      };

      this.http.post<any>('http://localhost:9002/matches/createMatch', matchDetails)
        .subscribe(
          (response) => {
            if (response.status === true) {
              console.log('Partida creada:', response);
              this.getMyMatches();
              this.closeModal(); //recargar tabla tras crear una partida
              this.openSnackBar('Partida creada', 'Cerrar'); 
            } else {
              this.openSnackBar(response.message, 'Cerrar'); 
            }


          },
          (error) => {
            console.error('Error al crear la partida:', error);
         
          }
        );
    }
  }
//unise a la partida 
  joinMatch(matchId: string) {
    const email = localStorage.getItem('correo'); 

    if (!email) {
      console.error('No se encuentra el correl en el LocalStorage');
      return;
    }

    const body = { email_usuario: email };

    this.http.patch(`http://localhost:9002/matches/joinMatch/${matchId}`, body)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.openSnackBar('Te has unido a la partida', 'Cerrar'); 
            this.showMatches();
            this.closeModal();
          } else {
            this.openSnackBar('Error al unirte a la partida', 'Cerrar'); 

          }
        },
        error: (err) => {
          console.error('Error :', err);
          alert('Error al unirte');
        }
      });
  }

  // Mostrar partidas
  showMatches() {
    this.selectedOption = '1'; // Setea valor 1 al checkbox
    this.http.get<any>('http://localhost:9002/matches/allMatches')
      .subscribe(
        (response) => {
          console.log('Partidas obtenidas:', response);
          this.dataSource.data = response.matches;
        },
        (error) => {
          console.error('Error al obtener las partidas:', error);
        }
      );
  }

  // Eliminar partida por ID
  deleteMatch(matchId: string): void {
    console.log(matchId)
    if (!this.correo) {
      console.error('Correo no encontrado en localStorage');
      return;
    }
  
    this.http.request<DeleteMatchResponse>('delete', `http://localhost:9002/matches/deleteMatch/${matchId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: { correo: this.correo }
    }).subscribe(response => {
      if (response.status) {
        console.log('Partida eliminada correctamente');
        this.openSnackBar('Partida eliminada', 'Cerrar'); 
        this.dataSource.data = this.dataSource.data.filter(match => match._id !== matchId);
      } else {
        console.error('Error al eliminar la partida:', response.message);
        this.openSnackBar('Error al eliminar', 'Cerrar'); 

      }
    }, error => {
      console.error('Error al comunicarse con el servidor:', error);
    });
  }
  

  // Devolver mis partidas 
  getMyMatches(): void {
    const correo = localStorage.getItem('correo');
  
    if (!correo) {
      console.error('Correo no encontrado en localStorage');
      return;
    }
  
    const params = new HttpParams().set('correo', correo);
  
    this.http.get<any>('http://localhost:9002/matches/myMatches', { params })
      .subscribe(
        response => {
          console.log('Partidas obtenidas propias:', response);
          if (response.status) {
            console.log('Tus partidas:', response.message);
            this.dataSource.data = response.matches;
          } else {
            console.error('Error al obtener tus partidas:', response.message);
          }
        },
        error => {
          console.error('Error al comunicarse con el servidor:', error);
        }
      );
  }

  openAddGameModal(element: any) {
    this.detailData = element;
    console.log(this.detailData)
    
    this.dialogRef = this.dialog.open(this.addGameModal, {
      width: '31rem',
      height: '22rem',
    });
  }

  openModifyMatchModal(element: any) {
    this.detailData = element;
    console.log(this.detailData);
    
    this.dialogRef = this.dialog.open(this.modifyMatchMod, {
      width: '31rem',
      height: '22rem',
    });
  }
  
  modifyMatch(matchId: string) {
    if (this.modifyMatchForm.valid && matchId) {
      // Aquí puedes manejar la lógica de envío del formulario
      console.log("Formulario enviado:", this.modifyMatchForm.value);
      const formData = this.modifyMatchForm.value;
      console.log("el formdata", formData);
      
      const url = `http://localhost:9002/matches/updateMatch/${matchId}`;
      this.http.patch(url, formData)
        .subscribe(
          (response) => {
            console.log('Partida modificada exitosamente:', response);
          },
          (error) => {
            console.error('Error al modificar la partida:', error);
          }
        );
      this.dialogRef.close();
    }
  }



  
match:any
  openConfirmDelete(idMatch: any) {
this.match = idMatch;
    this.dialogDel = this.dialog.open(this.deleteMatchMod, {
      width: '27rem',
      height: '20rem',
    });
  }



  onOptionChange(): void {
    if (this.selectedOption === '1') {
      this.showMatches(); // Si se selecciona 'Todas las partidas', obtener partidas generales
    } else if (this.selectedOption === '2') {
    this.getMyMatches(); // Si se selecciona 'Tus partidas', obtener tus partidas y las que te has unido
    }
    }
    

    closeModal(){
      this.addGameForm.reset();
    this.dialogRef.close();
    }
    }