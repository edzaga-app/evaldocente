import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TeacherToEvaluate } from 'src/app/core/models/teacherToEvaluate';
import { HomePageService } from 'src/app/core/services/pages/home-page.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  className = 'HomePageComponent';
  title = 'Reporte Consolidado de la evaluación docente';
  displayedColumns: string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  dataTeacherEvaluation = new MatTableDataSource<TeacherToEvaluate>();
  filteredOptions: Observable<[]>;
  myControl = new FormControl();
  isLoading = true;
  isFilter = false;
  teacherRecruitmen = {
    permanents: 'Planta y Transitorios',
    temporarys: 'Catedráticos'
  };

  constructor(private homePageService: HomePageService) { }

  ngAfterViewInit() {
    this.dataTeacherEvaluation.paginator = this.paginator;
  }

  async ngOnInit(): Promise <void> {
    const resources = await this.getTeacherToEvaluate();
    this.initializeTable(resources);
  }

  async initializeTable(teachers: TeacherToEvaluate[]): Promise <void> {
    try {
      this.isFilter = false;
      this.displayedColumns = ['see', 'teacherDocument', 'teacherName', 'strutureMoreCredits', 'evaluatorName'];
      //const teachers = await this.getTeacherToEvaluate();
      this.dataTeacherEvaluation = new MatTableDataSource(teachers);
      this.isLoading = false;
      this.dataTeacherEvaluation.paginator = this.paginator;

    } catch (err) {
      console.error(`Error en ${this.className} => initializeTable`, err);
      this.isLoading = true;
    }
  }

  public async getTeacherToEvaluate() {
    let res = null;
    let body = new Object();
    try {
      body = {
        evaluationId: 202,
        evaluatorId: "660594"
      };
      res = await this.homePageService.getTeacherToEvaluate(body);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  applyFilter(filterValue: string) {
    this.isFilter = true;
    this.dataTeacherEvaluation.filter = filterValue.trim().toLowerCase();
  }

  async searchChild(event) {
    // this.isChild = event.checked ? true : false;
    // if (this.isChild) {
    //   const child = await this.childrens();
    //   console.log(child);
      
    // }
  }

  getPosts(selected: string): void {
    // const index = this.bpmnDependencies.findIndex(m => m.module === selected);
    // if (index !== -1) {
    //   let moduleId = this.bpmnDependencies[index].moduleId;  
    //   this.dataBpmProcess.filterPredicate = (m => m.idmodulo === moduleId);
    //   this.dataBpmProcess.filter = moduleId;
    // }
  }

  





  

}
