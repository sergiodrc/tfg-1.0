import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';

export interface Tournaments {
  _id: string;
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

export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf(' ') > -1)) {
      const str = value.split(' ');
      const day = Number(str[0]);
      const month = Number(str[1]) - 1; // Month is zero-based
      const year = Number(str[2]);
      return new Date(year, month, day);
    }
    return null;
  }

  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD MM YYYY',
  },
  display: {
    dateInput: 'DD MM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class TournamentsComponent implements OnInit, AfterViewInit {
  addGameForm: FormGroup;
  displayedColumns = ['date', 'maxScore', 'minScore', 'creator', 'actions'];
  dataSource = new MatTableDataSource<Tournaments>([]);
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('addGameModal') addGameModal = {} as TemplateRef<string>;
  detailData: any;
  dialogRef: any;
  selectedOption: string = '1';
  correo: string | null = null;

  showDeleteIcons = false;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('en-GB'); // O cualquier otra configuración regional que prefieras
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
            this.closeModal();
            this.showMatches();
          },
          (error) => {
            console.error('Error al crear la partida:', error);
          }
        );
    }
  }

  showMatches() {
    this.selectedOption = '1';
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
        this.dataSource.data = this.dataSource.data.filter(match => match._id !== matchId);
      } else {
        console.error('Error al eliminar la partida:', response.message);
      }
    }, error => {
      console.error('Error al comunicarse con el servidor:', error);
    });
  }


  //devolver mis partidas
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
      this.showMatches();
    } else if (this.selectedOption === '2') {
      this.getMyMatches();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
