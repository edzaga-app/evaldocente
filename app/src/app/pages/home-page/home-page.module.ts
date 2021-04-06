import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';



@NgModule({
  declarations: [ HomePageComponent ],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  entryComponents:[],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule { }
