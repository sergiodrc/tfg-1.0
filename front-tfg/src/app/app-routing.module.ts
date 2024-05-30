import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { MessagesComponent } from './components/messages/messages.component';
import { TournamentsComponent} from './components/tournaments/tournaments.component';
import { MarketComponent } from './components/market/market.component';
import { UserComponent } from './components/user/user.component';

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
{
  path:'market', component: MarketComponent
},
{
  path:'user', component: UserComponent
},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
