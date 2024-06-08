import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator'; // Importa MatPaginator

export interface Tournaments {
  date: string;
  maxScore: number;
  minScore: number;
  creator: string;
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
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined; // Inyecta MatPaginator
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

  ngOnInit(): void {
    this.showMatches();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) { // Inicializa el paginador después de la vista
      this.dataSource.paginator = this.paginator;
    }
  }

  onSubmit() {
    if (this.addGameForm.valid) {
      const matchDetails = {
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

  showMatches() {
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
