import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ContainerComponent } from './shared/container/container.component';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { MessagesComponent } from './components/messages/messages.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog'; 
import {MatIconModule} from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { ErrorMessageDirective } from './directives/error-message.directive';
import { MarketComponent } from './components/market/market.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  
    HomeComponent,
    NavbarComponent,
    TimelineComponent,
    ContainerComponent,
    MessagesComponent,
    TournamentsComponent,
    BreadcrumbComponent,
    ErrorMessageDirective,
    MarketComponent,
    UserComponent, 
    // ErrorMessageDirective para controlar que el usuario rellene el campo (directiva creada)
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatRadioModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,HttpClientModule
   
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
