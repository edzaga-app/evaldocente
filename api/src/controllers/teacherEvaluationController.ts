import { NextFunction, Request, Response, Router } from 'express';
import { accessapproval } from 'googleapis/build/src/apis/accessapproval';
import { CONNREFUSED } from 'node:dns';
import { resourceUsage } from 'node:process';
import PostNotFoundException from '../exceptions/postNotFoundException';
import Auth from '../middlewares/auth';
import AverageResults from '../models/averageResults';
import HeteroQuestions from '../models/heteroQuestions';
import HeteroResults from '../models/heteroResults';
import Route from '../models/route';
import SpreadsheetsParams from '../models/spreadsheetsparams';
import TeacherEvaluationRepository from '../repository/teacherEvaluationRepository';
import SpreadSheet from '../utils/spreadsheet';

class TeacherEvaluationController implements Route {
  public path = '/teacherevaluation';
  public router = Router();
  private googlesheets = new SpreadSheet();
  private configsheet: SpreadsheetsParams = {
    spreadsheetId: process.env.SPREADSHEETID || '',
    sheetName: process.env.SHEETNAME || '' 
  };
  className = 'TeacherEvaluationController';
  teacher = new TeacherEvaluationRepository();
  authMiddleware = new Auth();
  
  
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Rutas apis evaldocente
    this.router.get(`${this.path}/evaluations`, this.authMiddleware.auth,  this.getActiveTeacherEvaluation);
    this.router.post(`${this.path}/teachertoevaluate`, this.authMiddleware.auth, this.getTeacherToEvaluate);
    this.router.post(`${this.path}/teachertoevaluatetemporary`, this.authMiddleware.auth, this.getTeacherToEvaluateTemporarys);
    this.router.get(`${this.path}/questionspermanents/:evaluationId`, this.authMiddleware.auth, this.getQuestionsPermanents);
    this.router.post(`${this.path}/heteroresults`, this.authMiddleware.auth, this.getHeteroResults);

    // Rutas api google
    this.router.get('/profesiones', this.getAll);
    this.router.get('/hoja', this.getDataSheet);
    this.router.get('/add', this.writeRows);
    this.router.get('/user', this.getUserById);
  }

  private getHeteroResults = async(request: Request, response: Response) => {
    try {
      const { evaluationId, teacherId } = request.body;
      const heteroResults = await this.teacher.geHeteroResults(evaluationId, teacherId);
      const results = this.createObjectHeteroResult(heteroResults!);
      const totalAverages = this.setTotalAverages(results!);

      response.json({ results, totalAverages });
      
    } catch (err) {
      console.error(`Error en geHeteroResults ${this.className} => `, err);
    }
  }

  /**
   * Establece los resultados de las calificaciones de los Estudiantes
   * a un docente
   * @param results Resultado de las calificaciones al docente
   * @returns Objeto con los resultados
   */
  private createObjectHeteroResult(results: HeteroResults[]) {
    let res = null;
    try {
      if (!results) return res;
      // Obtiene la lista de las asignaturas 
      const courses = results.reduce(this.setHeaders, []);
      // Construye el objeto relacionando los (Cursos, Calificaciones y Promedios)
      res = courses.map((result: HeteroResults) => {
        if (!result.groupId) return result;
        // Obtiene la calificación por grupo
        const groupRating = (rating: HeteroResults) => rating.groupId === result.groupId;
        const ratins = results.filter(groupRating);
        // Se calcula el promedio de las calificaciones excluyendo los datos atípicos
        const averages = this.setAveragesResults(ratins);
        // Se calcula el total del promedio por asignatura
        const averagePerCourse = this.calculateAveragePerCourse(averages);
       
        return {
          ...result,
          course: result.course, 
          groupId: result.groupId, 
          group: result.group,
          ratins: ratins,
          averages: averages,
          averagePerCourse: averagePerCourse
        };
      });
      
    } catch (err) {
      console.error(`Error en ${this.className} => createObjectHeteroResult`, err);
    } 
    return res;
  }

  private setTotalAverages(results: HeteroResults[]) {
    let res = null;
    try {
      const averages = results?.map(this.getAveragesPerCourse);
      const sum = averages.reduce(this.sumAveragePerCourse);
      res = Object.entries(sum).reduce((acc: any, [key, value]) => {
        if (key !== 'groupId' && key !== 'group' && key !== 'course') {
          acc[key] = (Number(value)) ? (Number(value) / results.length) : 0;
        }
        return acc;
      }, {});
      
    } catch (err) {
      console.error(`Error en ${this.className} => setTotalAverages`, err);
    }
    return res;
  }

  /**
   * Suma el total de los promedios ("de los promedios por pregunta")
   * @param results Objeto con el total del promedio de cada asignaturas
   * @param item Elemento de cada objeto de la lista
   * @returns Total promedio por asignatura
   */
  sumAveragePerCourse(results: HeteroResults, item: HeteroResults) {
    if (!results) return {};
    const sum = {...results };
    sum.q1! += item.q1!;
    sum.q2! += item.q2!;
    sum.q3! += item.q3!;
    sum.q4! += item.q4!;
    sum.q5! += item.q5!;
    sum.q6! += item.q6!;
    sum.q7! += item.q7!;
    sum.q8! += item.q8!;
    sum.q9! += item.q9!;
    sum.q10! += item.q10!;
    sum.q11! += item.q11!;
    sum.q12! += item.q12!;
    sum.q13! += item.q13!;
    sum.q14! += item.q14!;
    sum.q15! += item.q15!;
    sum.q16! += item.q16!;
    sum.q17! += item.q17!;
    sum.q18! += item.q18!;
    sum.q19! += item.q19!;
    sum.q20! += item.q20!;

    return sum;
    
  }

  /**
   * Obtiene los promedios por asignatura
   * @param results Objeto con el total del promedio de cada asignaturas
   * @returns Promedios por asignatura
   */
   getAveragesPerCourse(results: HeteroResults) {
    if (!results) return [];
    return results.averages;
  }

  /**
   * Calcula el total del promedio de una asignatura
   * @param averages Promedios por pregunta de cada asignatura
   * @returns El promedio total
   */
  private calculateAveragePerCourse(averages: object) : number {
    if (!averages) return 0;
    const totalKeys = Object.keys(averages);
    const tmpAverages: {[index: string]:any} = { ...averages };
    const sumAverages = totalKeys.reduce((acc: number, key: any) => {
      if (!key) return acc;
      if (key !== 'groupId' && key !== 'group' && key !== 'course') {
        acc! += tmpAverages[key];
      }
      return acc;
    }, 0);
    return (sumAverages > 0) ? sumAverages / 20 : 0;
  }

  private setAveragesResults(ratings: HeteroResults[]) {
    if (!ratings) return ratings;
    const sumRatings = ratings.reduce(this.sumRatings);
    return {
      groupId: sumRatings.groupId,
      group: sumRatings.group,
      course: sumRatings.course,
      q1: this.calculateAverage(sumRatings.q1!, 'q1', ratings),
      q2: this.calculateAverage(sumRatings.q2!, 'q2', ratings),
      q3: this.calculateAverage(sumRatings.q3!, 'q3', ratings),
      q4: this.calculateAverage(sumRatings.q4!, 'q4', ratings),
      q5: this.calculateAverage(sumRatings.q5!, 'q5', ratings),
      q6: this.calculateAverage(sumRatings.q6!, 'q6', ratings),
      q7: this.calculateAverage(sumRatings.q7!, 'q7', ratings),
      q8: this.calculateAverage(sumRatings.q8!, 'q8', ratings),
      q9: this.calculateAverage(sumRatings.q9!, 'q9', ratings),
      q10: this.calculateAverage(sumRatings.q10!, 'q10', ratings),
      q11: this.calculateAverage(sumRatings.q11!, 'q11', ratings),
      q12: this.calculateAverage(sumRatings.q12!, 'q12', ratings),
      q13: this.calculateAverage(sumRatings.q13!, 'q13', ratings),
      q14: this.calculateAverage(sumRatings.q14!, 'q14', ratings),
      q15: this.calculateAverage(sumRatings.q15!, 'q15', ratings),
      q16: this.calculateAverage(sumRatings.q16!, 'q16', ratings),
      q17: this.calculateAverage(sumRatings.q17!, 'q17', ratings),
      q18: this.calculateAverage(sumRatings.q18!, 'q18', ratings),
      q19: this.calculateAverage(sumRatings.q19!, 'q19', ratings),
      q20: this.calculateAverage(sumRatings.q20!, 'q20', ratings)
    }
    
  }

  private calculateAverage(questionValue: number, questionName: string, ratings: HeteroResults[]): number {
    const averages = this.averages(questionName, ratings);
    if (averages === 0) return 0;
    return questionValue / averages;
  }

  private averages(question: string, ratings: HeteroResults[]): number {
    return (ratings) ? ratings.filter((q: any) => q[question] !== null).length : 0;
  }

  /**
   * Regresa la suma de la calificacion de los estudiantes
   * por cada pregunta
   * @param rating Calificaciones de los estudiantes
   * @param result Elemento en el que se encuntra
   * @returns La suma de las calificaciones
   */
  private sumRatings(rating: HeteroResults, result: HeteroResults) {
    if (!result.groupId) return rating;
    const rat = {...rating};
    rat.groupId = result.groupId;
    rat.q1! += result.q1!;
    rat.q2! += result.q2!;
    rat.q3! += result.q3!;
    rat.q4! += result.q4!;
    rat.q5! += result.q5!;
    rat.q6! += result.q6!;
    rat.q7! += result.q7!;
    rat.q8! += result.q8!;
    rat.q9! += result.q9!;
    rat.q10! += result.q10!;
    rat.q11! += result.q11!;
    rat.q12! += result.q12!;
    rat.q13! += result.q13!;
    rat.q14! += result.q14!;
    rat.q15! += result.q15!;
    rat.q16! += result.q16!;
    rat.q17! += result.q17!;
    rat.q18! += result.q18!;
    rat.q19! += result.q19!;
    rat.q20! += result.q20!;
    return rat;
  }

  private setHeaders(acc: HeteroResults[], result: HeteroResults) {
    if(!result.groupId) return acc;
    const results = [...acc];
    const index = results.findIndex(m => m.groupId === result.groupId);
    if (index !== -1) return results;
    results.push({
      course: result.course,
      groupId: result.groupId,
      group: result.group
    });
    return results;
  }


  private getQuestionsPermanents = async(request: Request, response: Response, next: NextFunction) => {
    let res = null;
    try {
      const { evaluationId } = request?.params;
      if (!evaluationId) next(new PostNotFoundException(evaluationId));
      const questions = await this.teacher.getQuestionsPermanents(evaluationId);
      response.send(questions);
      
    } catch (err) {
      console.error(`Error en getQuestionsPermanents ${this.className} => `, err);
    }
  }

  private getTeacherToEvaluateTemporarys = async(request: Request, response: Response) => {
    let res = null;
    try {
      const { evaluationId } = request.body;
      const evaluatorId = this.getId(request);
      const [ userInfo, teachers ] = await Promise.all([
        this.teacher.getUser(evaluatorId),
        this.teacher.getTeacherToEvaluateTemporarys(evaluationId, evaluatorId)
      ]);
      res = { userInfo, teachers }; 
      response.send(res);
      
    } catch (err) {
      console.error(`Error en getTeacherToEvaluateTemporarys ${this.className} => `, err);
    }
  }

  private getTeacherToEvaluate = async(request: Request, response: Response) => {
    let res = null;
    try {
      const { evaluationId } = request.body;
      const evaluatorId = this.getId(request);
      const [ userInfo, teachers ] = await Promise.all([
        this.teacher.getUser(evaluatorId),
        this.teacher.getTeacherToEvaluate(evaluationId, evaluatorId)
      ]);
      res = { userInfo, teachers }; 
      response.send(res);

    } catch (err) {
      console.error(`Error en getTeacherToEvaluate ${this.className} => `, err);
    }
  }

  private getId(request: any): string {
    return request.user.id;
  }
  
  private getActiveTeacherEvaluation = async(request: Request, response: Response) => {
    let res = null;
    try {
      res = await this.teacher.getActiveTeacherEvaluation();
      response.send(res);
    } catch (err) {
      console.error(`Error en getActiveTeacherEvaluation ${this.className} => `, err);
    }
  }
  
  private getUserById = async (request: Request, response: Response) => {
    let res = null;
    try {
      res = await this.teacher.getUser('660594');
      response.send(res);
    } catch (err) {
      console.error(`Error en TeacherEvaluation => getAll`, err);
    }
  }

  private getAll = async (request: Request, response: Response) => {
    try {
      this.configsheet.auth = await this.googlesheets.getAuthToken(); 
      if (this.configsheet.spreadsheetId !== '' && this.configsheet.sheetName !== '') {
        const respons = await this.googlesheets.getSpreadSheet(this.configsheet);
        response.send(respons);
      }
      
    } catch (err) {
      console.error(`Error en TeacherEvaluation => getAll`, err);
    }
  }

  private getDataSheet = async (request: Request, response: Response) => {
    try {
      this.configsheet.auth = await this.googlesheets.getAuthToken(); 
      if (this.configsheet.spreadsheetId !== '' && this.configsheet.sheetName !== '') {
        const respons = await this.googlesheets.getSpreadSheetValues(this.configsheet);
        response.send(respons);
      }
      
    } catch (err) {
      console.error(`Error en TeacherEvaluation => getDataSheet`, err);
    }
  }

  private writeRows = async (request: Request, response: Response) => {
    try {
      this.configsheet.auth = await this.googlesheets.getAuthToken(); 
      this.configsheet.fromTo = '!A:B';
      this.configsheet.valueInputOption = 'USER_ENTERED';
      if (this.configsheet.spreadsheetId !== '' && this.configsheet.sheetName !== '') {
        const respons = await this.googlesheets.writeRows(this.configsheet);
        response.send(respons);
      }
      
    } catch (err) {
      console.error(`Error en TeacherEvaluation => writeRows`, err);
    }
  }

}

export default TeacherEvaluationController;