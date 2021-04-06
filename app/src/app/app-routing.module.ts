import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './core/components/nav/nav.component';
import { navRoutes } from './nav-routing';

export const sideNavPath = 'app';

const routes: Routes = [
  {
    path: sideNavPath,
    component: NavComponent,
    children: navRoutes
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
