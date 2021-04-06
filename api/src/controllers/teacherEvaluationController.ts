import { Request, Response, Router } from 'express';
import Auth from '../middlewares/auth';
import Route from '../models/route';
import SpreadsheetsParams from '../models/spreadsheetsparams';
import TeacherEvaluationRepository from '../repository/teacherEvaluationRepository';
import SpreadSheet from '../utils/spreadsheet';

class TeacherEvaluationController implements Route {
  public path = '/teacherevaluation'
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

  public initializeRoutes() {
    this.router.get(`${this.path}/evaluations`, this.authMiddleware.auth,  this.getActiveTeacherEvaluation);
    this.router.post(`${this.path}/teachertoevaluate`, this.authMiddleware.auth, this.getTeacherToEvaluate);

    this.router.get('/profesiones', this.getAll);
    this.router.get('/hoja', this.getDataSheet);
    this.router.get('/add', this.writeRows);
    this.router.get('/user', this.getUserById);
  }

  getTeacherToEvaluate = async(request: Request, response: Response) => {
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

      // res = await this.teacher.getTeacherToEvaluate(evaluationId, evaluatorId);
      // const userInfo = await this.teacher.getUser(evaluatorId);
      // response.json({
      //   teachers: res,
      //   userInfo: userInfo
      // });

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
  }

  getId(request: any): string {
    return request.user.id;
  }
  
  getActiveTeacherEvaluation = async(request: Request, response: Response) => {
    let res = null;
    try {
      res = await this.teacher.getActiveTeacherEvaluation();
      response.send(res);
    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
  }
  


  getUserById = async (request: Request, response: Response) => {
    let res = null;
    try {
      res = await this.teacher.getUser('660594');
      response.send(res);
    } catch (err) {
      console.error(`Error en TeacherEvaluation => getAll`, err);
    }
  }

  getAll = async (request: Request, response: Response) => {
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

  getDataSheet = async (request: Request, response: Response) => {
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

  writeRows = async (request: Request, response: Response) => {
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