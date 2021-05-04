import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsolidatedReportComponent } from './consolidated-report.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConsolidatedReportRoutingModule } from './consolidated-report-routing.module';
import { HeteroevaluationComponent } from '../../core/components/reports/consolidated/heteroevaluation/heteroevaluation.component';
import { SelfevaluationComponent } from '../../core/components/reports/consolidated/selfevaluation/selfevaluation.component';
import { CoevaluationComponent } from '../../core/components/reports/consolidated/coevaluation/coevaluation.component';

@NgModule({
  declarations: [
    ConsolidatedReportComponent,
    HeteroevaluationComponent,
    SelfevaluationComponent,
    CoevaluationComponent
  ],
  imports: [
    CommonModule,
    ConsolidatedReportRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class ConsolidatedReportModule { }
