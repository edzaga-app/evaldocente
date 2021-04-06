interface SpreadsheetsParams {
    spreadsheetId: string;
    auth?: any;
    sheetName: string;
    fromTo?: string;
    valueInputOption?: string;
    valueRows?: any[];
}

export default SpreadsheetsParams;