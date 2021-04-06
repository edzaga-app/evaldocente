import oracledb from 'oracledb';
import db from '../config/database';

class CrudRepository {
  className = 'CrudRepository';
  constructor() { }


  /**
   * Obtiene los registros de una consulta, tabla o vista
   * @param query Cadena con la consulta que se desea ejecutar
   * @param params Parametros por la que se desea filtra la consulta
   * @returns Lista de registros de la consulta
   */
  public async get<Type>(query: string, params: Array<string>): Promise<Type[] | null> {
    let res = null;
    let conn;
    try {
      conn = await oracledb.getConnection(db);
      const result = await conn.execute(
        query,
        params,
        { outFormat: oracledb.OUT_FORMAT_OBJECT}
      );
      res = result.rows ? <Type[]>result.rows : null;

    } catch (err) {
      console.error(`Error en CrudRepository => get`, err);
    } finally {
      if (conn) {
        await conn.close();
      }
    }
    return res;
  }

  /**
   * Obtiene un solo valor como resultado de una consulta
   * @param query Cadena con la consulta que se desea ejecutar
   * @param id Parametro por el que se desea filtra la consulta
   * @returns Valor de una consulta
   */
  public async getValue(query: string, id: number | string): Promise<number | string | null> {
    let res = null;
    let conn;
    let value: any;
    try {
      conn = await oracledb.getConnection(db);
      const result = await conn.execute(
        query,
        [id]
      );

      if (result.rows?.length! > 0) {
        value = result.rows;
        res = value[0][0];
      }

    } catch (err) {
      console.error(`Error en ${this.className} => getValue`, err);
    } finally {
      if (conn) {
        await conn.close();
      }
    }
    return res;
  }


}

export default CrudRepository;


