import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TeacherToEvaluate } from 'src/app/core/models/teacherToEvaluate';
import { HomePageService } from 'src/app/core/services/pages/home-page.service';

enum teacherRecruitmentType {
  permanents = 'permanents',
  temporarys = 'temporarys',
  virtuals = 'virtuals'
}

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
    temporarys: 'Catedráticos',
    virtuals: 'Virtuales'
  };

  constructor(private homePageService: HomePageService) { }

  ngAfterViewInit() {
    this.dataTeacherEvaluation.paginator = this.paginator;
  }

  async ngOnInit(): Promise <void> {
    const resources = await this.getTeacherToEvaluate();
    this.initializeTable(resources.teachers);
  }

  async teacherRecruitmentType(type: string) {
    switch (type) {
      case teacherRecruitmentType.permanents:
        this.clearTable();
        const permanents = await this.getTeacherToEvaluate();
        this.initializeTable(permanents?.teachers);
        break;

      case teacherRecruitmentType.temporarys:
        this.clearTable();
        const temporarys = await this.getTeacherToEvaluateTemporarys();
        this.initializeTable(temporarys.teachers);
        break;

      case teacherRecruitmentType.virtuals:
        break;

      default:
        break;
    }
  }
  
  clearTable() {
    this.dataTeacherEvaluation.data = [];
    this.isLoading = true;
  }

  initializeTable(teachers: TeacherToEvaluate[]) {
    try {
      this.isFilter = false;
      this.displayedColumns = ['see', 'teacherDocument', 'teacherName', 'strutureMoreCredits', 'evaluatorName'];
      this.dataTeacherEvaluation = new MatTableDataSource(teachers);
      this.isLoading = false;
      this.dataTeacherEvaluation.paginator = this.paginator;

    } catch (err) {
      console.error(`Error en ${this.className} => initializeTable`, err);
      this.isLoading = true;
    }
  }

  public async getTeacherToEvaluateTemporarys() {
    let res = null;
    let body = new Object();
    try {
      body = { evaluationId: 202 };
      res = await this.homePageService.getTeacherToEvaluateTemporarys(body);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  public async getTeacherToEvaluate() {
    let res = null;
    let body = new Object();
    try {
      body = { evaluationId: 202 };
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
