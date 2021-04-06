import { google } from 'googleapis';
import SpreadsheetsParams from '../models/spreadsheetsparams';

class SpreadSheet {
  sheets = google.sheets('v4');

  constructor() { }
  /**
   * Verifica la autencitación de las apis de google
   * @returns authToken: son las credenciales de autenticación
   */
  public getAuthToken = async() => {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
      });
      // Crea la instancia del cliente para la autenticación
      const authToken = await auth.getClient();
      return authToken;
      
    } catch (err) {
      console.error(`Error en SpreadSheet => getAuthToken`, err);
    }
  }

  /**
   * Obtiene la metada de las hojas de cálculo de google
   * @param spreadsheetsParams Objeto para la configuración y autenticación
   * @returns la metadata
   */
  public getSpreadSheet = async(spreadsheetsParams: SpreadsheetsParams) => {
    try { 
      const res = await this.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetsParams.spreadsheetId,
        auth: spreadsheetsParams.auth
      });
      return res;

    } catch (err) {
      console.error(`Error en SpreadSheet => getSpreadSheet`, err);
    }
  }

  /**
   * Obtiene el contenido de las celdas de las hojas de cálculo
   * @param spreadsheetsParams Objeto para la configuración y autenticación
   * @returns Los valores de las celdas de la hoja de cálculo 
   */
  public getSpreadSheetValues = async(spreadsheetsParams: SpreadsheetsParams) => {
    try {
      const res = await this.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetsParams.spreadsheetId,
        auth: spreadsheetsParams.auth,
        range: spreadsheetsParams.sheetName
      });
      return res;

    } catch (err) {
      console.error(`Error en SpreadSheet => getSpreadSheetValue`, err);
    }
  }

  /**
   * Escribe en la hoja de cáculo las filas ingresadas
   * @param spreadsheetsParams Objeto para la configuración y autenticación
   * @returns La lista de valores de las celdas insertadas de la hoja de cálculo 
   */
  public writeRows = async(spreadsheetsParams: SpreadsheetsParams) => {
    try {
      const res = await this.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetsParams.spreadsheetId,
        auth: spreadsheetsParams.auth,
        range: `${spreadsheetsParams.sheetName}${spreadsheetsParams.fromTo}`,
        valueInputOption: spreadsheetsParams.valueInputOption,
        requestBody: {
          values:[
            ['Node c#', 'edzaga'],
            ['Node oracle', 'edzaga']
          ]
        }
      
      });
      return res;

    } catch (err) {
      console.error(`Error en SpreadSheet => writeRows`, err);
    }
  }






}

export default SpreadSheet;