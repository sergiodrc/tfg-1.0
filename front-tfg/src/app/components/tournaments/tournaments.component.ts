import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';

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
  displayedColumns = ['date', 'maxScore', 'minScore', 'creator', 'actions'];
  dataSource = new MatTableDataSource<Tournaments>([]);
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('addGameModal') addGameModal = {} as TemplateRef<string>;
  detailData: any;
  dialogRef: any;
  selectedOption: string = '1';
  correo: string | null = null; // Correo del usuario almacenado en localStorage

  showDeleteIcons = false;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient
  ) 
  {
    this.addGameForm = this.fb.group({
      date: ['', Validators.required],
      puntMax:['', Validators.required],
      puntMin:['', Validators.required],
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
            console.log('Partida creada:', response);
            this.showMatches(); // Actualiza la tabla después de crear una partida
          },
          (error) => {
            console.error('Error al crear la partida:', error);
            // Abre modal de error
          }
        );
    }
  }

  showMatches() {
    this.selectedOption = '1'; //setea valor 1 al checkbox
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

  deleteMatch(matchId: string): void {
    if (!this.correo) {
      console.error('Correo no encontrado en localStorage');
      return;
    }

    const body = { id: matchId, correo: this.correo };

    this.http.request<DeleteMatchResponse>('delete', 'http://localhost:9002/matches/deleteMatch', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: body
    }).subscribe(response => {
      if (response.status) {
        console.log('Partida eliminada correctamente');
        // Actualiza la tabla eliminando el registro correspondiente
        this.dataSource.data = this.dataSource.data.filter(match => match._id !== matchId);
      } else {
        console.error('Error al eliminar la partida:', response.message);
      }
    }, error => {
      console.error('Error al comunicarse con el servidor:', error);
    });
  }

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

    this.dialogRef = this.dialog.open(this.addGameModal, {
      width: '31rem',
      height: '22rem',
    });
  }


  onOptionChange(): void {
    if (this.selectedOption === '1') {
      this.showMatches(); // Si se selecciona 'Todas las partidas', obtener partidas generales
    } else if (this.selectedOption === '2') {
      this.getMyMatches(); // Si se selecciona 'Tus partidas', obtener tus partidas
    }
  }

  closeModal(){
    this.dialogRef.close();
  }
}
