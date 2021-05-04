import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HeteroQuestions } from 'src/app/core/models/heteroQuestions';

import { EvaluationQuestion } from '../../../../models/evaluationQuestion';
import { ConsolidatedService } from '../../../../services/reports/consolidated.service';

@Component({
  selector: 'app-heteroevaluation',
  templateUrl: './heteroevaluation.component.html',
  styleUrls: ['./heteroevaluation.component.scss']
})
export class HeteroevaluationComponent implements OnInit {
  className = 'HeteroevaluationComponent';
  evaluationId = '202'; // temporalmente para este periodo académico

  questionsColumns: string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('container') container : ElementRef;
  
  dataQuestions = new MatTableDataSource<EvaluationQuestion>();
  isLoading = true;
  isFilter = false;

  heteroResults: any[];
  heteroTotalAverages: HeteroQuestions;
  
  // Propiedades del gráfico
  chartsCourse: any[];
  chartsQuestions: any[];

  // Propiedades asignatura
  view: any[];
  showXAxis: boolean;
  showYAxis: boolean;
  gradient: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  showYAxisLabel: boolean;
  yAxisLabel: string;
  yAxisTicksSize: any[];
  colorScheme = new Object();
  legend: boolean;
  legendTitle: string;
  showDataLabel: boolean;
  barPadding: number;
  // Propiedades preguntas
  legendQuestion: boolean;
  barPaddingQuestion: number;

  constructor(private consolidatedService: ConsolidatedService,
    private decimalPipe: DecimalPipe) { 
 
  }


  // chart
  onSelect(event) {
    console.log(event);
  }
  // charts

  ngAfterViewInit() {
    this.dataQuestions.paginator = this.paginator;
  }

  async ngOnInit(): Promise<void> {
    
    const [ questions, heteroResults ] = await Promise.all([
      this.getQuestions(),
      this.getHeteroResults()
    ]);
    this.initializeTableQuestions(questions);
    this.heteroResults = heteroResults?.results;
    this.heteroTotalAverages = heteroResults?.totalAverages;
    this.initializeTableHeteros(heteroResults?.results);

    /* Propiedades para los gráficos */
    this.initializeChartsProperties();
    this.setChartDataHeteroCourse(heteroResults?.results);
    this.setChartDataHeteroAverages(heteroResults?.totalAverages);
    

    

  }

  /**
   * Inicializa las caracteristicas que se definen 
   * a las gráficas algunas se comparten las otras se 
   * definen individual
   */
  initializeChartsProperties() {
    // Por asignatura
    this.view = [this.container.nativeElement.offsetWidth -1, 400];
    this.showXAxis = true;
    this.showYAxis = true;
    this.gradient = false;
    this.showXAxisLabel = true;
    this.xAxisLabel = '';
    this.showYAxisLabel = true;
    this.yAxisLabel = '';
    this.yAxisTicksSize = [0,1,2,3,4,5];
    this.colorScheme = {
      domain: ['#2196f3', '#03a9f4', '#29b6f6', '#81d4fa']
    };
    this.legend = true;
    this.legendTitle = 'Asignaturas';
    this.showDataLabel = true;
    this.barPadding = 50;
    // Por pregunta
    this.legendQuestion = false;
    this.barPaddingQuestion = 10;

  }

  setChartDataHeteroAverages(averages: HeteroQuestions) {
    if (!averages) return null;
    const questions = Object.entries(averages).reduce((acc: any, [key, value]) => {
      return [...acc,
      {
        name: key.replace('q', 'P'),
        value: this.toDecimal(value)
      }];

    }, []);
    this.chartsQuestions = questions;
  }

  setChartDataHeteroCourse(heteroResults: any[]) {
    if (!heteroResults) return null;
    const dataChart = heteroResults.reduce((acc, item) => {
      return [...acc,
        {
          name: `${item.course} ${item.group}`,
          value: this.toDecimal(item.averagePerCourse)
        }
      ];
    }, []);
    this.chartsCourse = dataChart;

  }

  toDecimal(value: number | string) {
    return this.decimalPipe.transform(value, '1.2-2');
  }

  setColor(answer: number | string): string {
    if (!answer) return '#bee5eb';
    if (answer >= 5) return '#58D68D';
    if (answer >= 4) return '#82E0AA';
    if (answer >= 3) return '#F4D03F';
    if (answer >= 2) return '#F5B041 ';
    if (answer < 2) return '#EC7063';
  }

  initializeTableQuestions(questions: EvaluationQuestion[]) {
    try {
      this.isFilter = false;
      this.questionsColumns = ['question', 'content'];
      this.dataQuestions = new MatTableDataSource(questions);
      this.isLoading = false;
      this.dataQuestions.paginator = this.paginator;

    } catch (err) {
      console.error(`Error en ${this.className} => initializeTable`, err);
      this.isLoading = true;
    }
  }

  initializeTableHeteros(questions: any[]) {
    try {
      // this.isFilter = false;
      // this.questionsColumns = ['question', 'content'];
      // this.dataQuestions = new MatTableDataSource(questions);
      // this.isLoading = false;
      // this.dataQuestions.paginator = this.paginator;

    } catch (err) {
      console.error(`Error en ${this.className} => initializeTable`, err);
      this.isLoading = true;
    }
  }

  public async getQuestions() {
    let res = null;
    try {
      res = await this.consolidatedService.getQuestions(this.evaluationId);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  public async getHeteroResults() {
    let res = null;
    try {
      // Capturar el id del tercero seleccionado
      const body = {
        evaluationId: this.evaluationId,
        teacherId: 67531
      };

      res = await this.consolidatedService.getHeteroResults(body);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  applyFilter(filterValue: string) {
    this.isFilter = true;
    this.dataQuestions.filter = filterValue.trim().toLowerCase();
  }

}
