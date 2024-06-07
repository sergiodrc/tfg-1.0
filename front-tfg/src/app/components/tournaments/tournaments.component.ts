import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Tournaments {
  date: string;
  maxScore: number;
  minScore: number;
  creator: string;
}

interface MatchDetails {
  fecha_partida: string;
  puntuacion_maxima_partida: number;
  puntuacion_minima_partida: number;
  creador_partida: string;
}

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css'],
})
export class TournamentsComponent implements OnInit {
  addGameForm: FormGroup;
  displayedColumns = ['date', 'maxScore', 'minScore', 'creator', 'actions'];
  dataSource = new MatTableDataSource<Tournaments>(gameData);
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild('addGameModal') addGameModal = {} as TemplateRef<string>;
  detailData: any;
  dialogRef: any;

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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onSubmit() {
    if (this.addGameForm.valid) {
      const matchDetails: MatchDetails = {
        fecha_partida: this.addGameForm.value.date,
        puntuacion_maxima_partida: this.addGameForm.value.puntMax,
        puntuacion_minima_partida: this.addGameForm.value.puntMin,
        creador_partida: localStorage.getItem('correo') || ''
      };

      this.http.post<any>('http://localhost:9002/matches/createMatch', matchDetails)
        .subscribe(
          (response) => {
            console.log('Partida creada:', response);
         //abrir el modal de confirmacion
          },
          (error) => {
            console.error('Error al crear la partida:', error);
            //abrir modal error
          }
        );
    }
  }

  openAddGameModal(element: any) {
    this.detailData = element;

    this.dialogRef = this.dialog.open(this.addGameModal, {
      width: '31rem',
      height: '22rem',
    });
  }

  closeModal(){
    this.dialogRef.close();
  }
}

// objeto de pruebas para la tabla
const gameData = [
  {
    date: '22/05/2024',
    maxScore: 9005,
    minScore: 6500,
    creator: 'juanpe',
  },
  {
    date: '15/07/2024',
    maxScore: 2000,
    minScore: 1500,
    creator: 'minxu',
  },
  {
    date: '02/06/2024',
    maxScore: 12000,
    minScore: 8000,
    creator: 'pacopope',
  },
];
