import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavComponent } from './nav.component';
import { NavToolbarComponent } from './nav-toolbar/nav-toolbar.component';
import { LogoModule } from '../logo/logo.module';
import { NavMenuItemComponent } from './nav-menu-item/nav-menu-item.component';

@NgModule({
  declarations: [
    NavComponent,
    NavToolbarComponent,
    NavMenuItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    LogoModule,
    FlexLayoutModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
  ]
})
export class NavModule { }
