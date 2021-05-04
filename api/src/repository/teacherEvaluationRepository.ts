import oracledb from 'oracledb';
import db from '../config/database';
import Evaluation from '../models/evaluation';
import EvaluationQuestion from '../models/evaluationQuestion';
import HeteroResults from '../models/heteroResults';
import TeacherToEvaluate from '../models/teacherToEvaluate';
import User from '../models/user';
import CrudRepository from './crudRepository';

class TeacherEvaluationRepository extends CrudRepository{
  className = 'TeacherEvaluationRepository';

  constructor() {
    super();
  }

  public async getComments(evaluationId: number | string, teacherId: number | string) {
    let res = null;
    let query: string;
    let bind: string[] = [];
    try { 

    } catch (err) {
      console.error(`Error en ${this.className} => getComments`, err);
    }
    return res;
  }

  /**
   * Obtiene la calificación que los estudiantes dieron al docente
   * en sus asignaturas
   * @param evaluationId Id de la evaluación docente
   * @param teacherId id del docente al que se evaluó
   * @returns la calificación de los estudiantes
   */
  public async geHeteroResults(evaluationId: number | string, teacherId: number | string): Promise <HeteroResults[] | null> {
    let res = null;
    let query: string;
    let bind: string[] = [];
    try {
      bind.push(evaluationId.toString(), teacherId.toString());
      query = `
        SELECT ASIGNATURA AS "course",
          IDGRUPO AS "groupId",
          GRUPO AS "group",
          ESTUDIANTE AS "stundent",
          P1 AS "q1",
          P2 AS "q2",
          P3 AS "q3",
          P4 AS "q4",
          P5 AS "q5",
          P6 AS "q6",
          P7 AS "q7",
          P8 AS "q8",
          P9 AS "q9",
          P10 AS "q10",
          P11 AS "q11",
          P12 AS "q12",
          P13 AS "q13",
          P14 AS "q14",
          P15 AS "q15",
          P16 AS "q16",
          P17 AS "q17",
          P18 AS "q18",
          P19 AS "q19",
          P20 AS "q20"
        FROM TABLE(PKG_REPORTES.FUN_OBTENERRESULTADOSHETERO(:evaluationId, :teacherId))`;
      res = await this.get<HeteroResults>(query, bind);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  /**
   * Obtine las preguntas de la heteroevaluacion para 
   * los docentes de planta y transitorio 
   * @param evaluationId Id de la evalucación docente
   * @returns Las preguntas (intrumentos)
   */
  public async getQuestionsPermanents(evaluationId: number | string): Promise <EvaluationQuestion[] | null> {
    let res = null;
    let query: string;
    let bind: string[] = [];
    try {
      bind.push(evaluationId.toString());
      query = `
        SELECT NUMPREGUNTA AS "questionId",
          PREGUNTA AS	"question",
          CONTENIDO AS "content"
        FROM VI_EVDO_PREGUNTASPLANTA
        WHERE IDEVALUACION = :evaluationId`;
      res = await this.get<EvaluationQuestion>(query, bind);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  /**
   * Obtiene los docentes catedráticos que se van a evaluar en la heteroevalución
   * @param evaluationId Id de la evalucación docente
   * @param evaluatorId Id del usuario que ingresa a la aplicación
   * @returns los docentes catedráticos a evaluar
   */
  public async getTeacherToEvaluateTemporarys(evaluationId: number | string, evaluatorId: number | string): Promise <TeacherToEvaluate[] | null> {
    let res = null;
    let query: string;
    let bind: string[] = [];
    try {
      bind.push(evaluationId.toString(), evaluatorId.toString());
      query = `
        SELECT IDTERCERO AS "teacherId",
          NUMERODOCUMENTO AS "teacherDocument",
          NOMBRE AS "teacherName",
          ESTRUCTURA AS "strutureMoreCredits",
          '' AS "evaluatorName"
        FROM TABLE(PKG_EVALDOCENTE.FUN_OBTENERDOCENTESCATEDRA(:evaluationId, :evaluatorId))`;
      res = await this.get<TeacherToEvaluate>(query, bind);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  /**
   * Obtiene los docentes que se van a evaluar en la heteroevalución
   * @param evaluationId Id de la evalucación docente
   * @param evaluatorId Id del usuario que ingresa a la aplicación
   * @returns los docentes a evaluar
   */
  public async getTeacherToEvaluate(evaluationId: number | string, evaluatorId: number | string): Promise <TeacherToEvaluate[] | null> {
    let res = null;
    let query: string;
    let bind: string[] = [];
    try {
      bind.push(evaluationId.toString(), evaluatorId.toString());
      query = `
        SELECT IDTERCERO AS "teacherId",
          NUMERODOCUMENTO AS "teacherDocument",
          NOMBRE AS "teacherName",
          ESTRUCTURAMASCRED AS "strutureMoreCredits",
          NOMBREEVALUADOR AS "evaluatorName"
        FROM TABLE(PKG_REPORTES.FUN_OBTENERDOCENTESEVALUAR(:evaluationId, :evaluatorId))`;
      res = this.get<TeacherToEvaluate>(query, bind);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  /**
   * Obtiene el id del periodo académico de cada evaluación docente
   * @param evaluationId Id de la evalucación docente
   * @returns idperiodoacademico
   */
  private async getPeriodEvaluate(evaluationId: number | string): Promise<number | string | null> {
    let res = null;
    let query: string;
    try {
      query = `
        SELECT IDPERIODOACADEMICO AS "periodAcademicId"
        FROM TB_EVDO_PERACADEMICOSXEVAL
        WHERE IDEVALUACIONPRUEBA IN (:testEvaluationId)`;
      
      const evaluation = await this.getTestEvaluationId(evaluationId);
      if (!evaluation) return res;

      res = await this.getValue(query, evaluationId);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  /**
   * Obtiene el id de la evaluación de las pruebas de cada
   * evaluación docente
   * @param evaluationId Id de la evalucación docente
   * @returns idevaluacionprueba
   */
  private async getTestEvaluationId(evaluationId: number | string): Promise<number | string | null> {
    let res = null;
    let query: string;
    try {
      query = `
        SELECT IDEVALUACIONPRUEBA AS "testEvaluationId"
        FROM TB_EVDO_EVALUACIONPRUEBA
        WHERE IDEVALUACION = :evaluationId
        AND TIPOEVALUACION = 2`;
      res = await this.getValue(query, evaluationId);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }

  /**
   * Obtiene las evaluaciones docentes de cada
   * periodo académico
   * @returns Evaluaciones docentes activas
   */
  public async getActiveTeacherEvaluation(): Promise <Evaluation[] | null> {
    let res = null;
    let query: string;
    let bind: string[] = [];
    try {
      query = `
        SELECT IDEVALUACION AS "evaluationId",
          SEGURIDAD.PKG_SEG_SEGURIDAD.ENCRIPTAR3(IDEVALUACION) AS "encriptEvaluationId",
          NOMBRE AS "name",
            ACTIVA AS "active"
        FROM TB_EVDO_EVALUACION				
        ORDER BY IDEVALUACION DESC`;
      res = this.get<Evaluation>(query, bind);

    } catch (err) {
      console.error(`Error en ${this.className} => `, err);
    }
    return res;
  }


  /**
   * Obtiene el usuario de la aplicación con acceso 
   * a la evaluación docente
   * @param thirdpartyId Id del tercero
   * @returns datos básicos del usurio 
   */
  public async getUser(thirdpartyId: string): Promise<User | null> {
    let res = null;
    let query: string;
    let bind: string[] = [];
    try {
      if(!thirdpartyId) return res;
      bind.push(thirdpartyId);
      query = `
        SELECT IDTERCERO AS "thirdpartyId", 
          IDTERCEROENCRIPTADO AS "encriptThirdpartyId",
          NUMERODOCUMENTO AS "documentNumber", 
          NOMBRE AS "name", 
          EMAIL AS "email", 
          IDGRUPO AS "groupId", 
          GRUPO AS "group"
        FROM VI_EVDO_USUARIO
        WHERE IDTERCERO = :thirdpartyId`;
      const user = await this.get<User>(query, bind);
      
      res = user?.reduce((obj: any, item: User) => {
        obj = item;
        return obj;
      }, {});

    } catch (err) {
      console.error(`Error en ${this.className} => TeacherEvaluationRepository`, err);
    }
    return res;
  }
  
  

}

export default TeacherEvaluationRepository;