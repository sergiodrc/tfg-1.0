import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @ViewChild('addCommentMod') addCommentMod = {} as TemplateRef<string>;
  commentData: any;
  dialogComment: any;





  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }



  openCommentModal(element: any) {
    this.commentData = element;
    this.dialogComment = this.dialog.open(this.addCommentMod, {
      width: '45rem',
      height: '30rem',
    });
  }
  closeCommentModal(){
    this.dialogComment.close();
  }
}
