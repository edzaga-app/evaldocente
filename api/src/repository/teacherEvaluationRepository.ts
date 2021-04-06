import oracledb from 'oracledb';
import db from '../config/database';
import Evaluation from '../models/evaluation';
import TeacherToEvaluate from '../models/teacherToEvaluate';
import User from '../models/user';
import CrudRepository from './crudRepository';

class TeacherEvaluationRepository extends CrudRepository{
  className = 'TeacherEvaluationRepository';

  constructor() {
    super();
  }

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