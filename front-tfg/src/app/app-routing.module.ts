import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { TimelineComponent } from './timeline/timeline.component';
import { MessagesComponent } from './messages/messages.component';
import { TournamentsComponent} from './tournaments/tournaments.component';

// aqui se establecen todas las rutas y los componentes
const routes: Routes = [
  {
    path:'', component: LoginComponent
  },
  {
    path:'home', component: HomeComponent
  },
  {
    path:'register', component: RegisterComponent
  },
  {
    path:'timeline', component: TimelineComponent
  },
  {
    path:'messages', component: MessagesComponent
  },

{
  path:'tournaments', component: TournamentsComponent
},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
