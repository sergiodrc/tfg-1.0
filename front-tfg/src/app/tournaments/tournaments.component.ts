import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'; // Asegúrate de importar MatDialog
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Tournaments {
  date: string;
  maxScore: number;
  minScore: number;
  creator: string;
}

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css'],
})
export class TournamentsComponent implements OnInit {
  addGameForm: FormGroup;
  displayedColumns = ['date', 'maxScore', 'minScore', 'creator', 'actions'];
  dataSource = new MatTableDataSource(gameData);
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild('addGameModal') addGameModal = {} as TemplateRef<string>;
  detailData: any;


  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder
  ) 
  {
this.addGameForm=this.fb.group({
  date: ['',Validators.required],
  puntMax:['',Validators.required],
  puntMin:['',Validators.required],
})


  }
  dialogRef: any;
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
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
