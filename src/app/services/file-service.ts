import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import JSZip from 'jszip';

export interface ExcelSheet {
  name: string;
  data: any[][];
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  // Leer archivo Excel con múltiples hojas
  async readExcelFile(file: File): Promise<ExcelSheet[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheets: ExcelSheet[] = [];
          
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            sheets.push({
              name: sheetName,
              data: jsonData
            });
          });
          
          resolve(sheets);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // Convertir Excel a SQL INSERT
  excelToSqlInsert(data: any[][], tableName: string = 'table_name', batchSize: number = 1000, treatEmptyAsNull: boolean = true): string {
    console.log('excelToSqlInsert llamado con:', { data, tableName, batchSize, treatEmptyAsNull });
    
    if (!data || data.length === 0) {
      console.log('Datos vacíos, retornando string vacío');
      return '';
    }
    
    const headers = data[0] as string[];
    const rows = data.slice(1);
    
    console.log('Headers:', headers);
    console.log('Rows count:', rows.length);
    console.log('First row:', rows[0]);
    console.log('Tratar vacíos como NULL:', treatEmptyAsNull);
    
    let sql = '';
    let currentBatch = 0;
    
    // Procesar filas en lotes
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const valuesList = batch.map((row: any[]) => {
        const values = row.map((value: any) => {
          console.log('Procesando valor:', value, 'tipo:', typeof value, 'es null:', value === null, 'es undefined:', value === undefined);
          
          // Caso 1: Valores null o undefined
          if (value === null || value === undefined) {
            console.log('Valor es null/undefined, retornando NULL');
            return 'NULL';
          }
          
          // Caso 2: Strings vacíos
          if (typeof value === 'string' && value.trim() === '') {
            const result = treatEmptyAsNull ? 'NULL' : "''";
            console.log('String vacío detectado, retornando:', result);
            return result;
          }
          
          // Caso 3: Números que podrían representar celdas vacías (0, NaN)
          if (typeof value === 'number') {
            if (isNaN(value)) {
              const result = treatEmptyAsNull ? 'NULL' : "''";
              console.log('NaN detectado, retornando:', result);
              return result;
            }
            // Si es 0, lo dejamos como número
            console.log('Número válido:', value);
            return value;
          }
          
          // Caso 4: Convertir a string y verificar si está vacío después de trim
          const stringValue = String(value).trim();
          console.log('StringValue después de trim:', `"${stringValue}"`, 'longitud:', stringValue.length);
          
          if (stringValue === '') {
            const result = treatEmptyAsNull ? 'NULL' : "''";
            console.log('Campo vacío detectado después de conversión, retornando:', result);
            return result;
          }
          
          // Caso 5: Strings válidos
          if (typeof value === 'string') {
            const escapedValue = `'${value.replace(/'/g, "''")}'`;
            console.log('String procesado:', escapedValue);
            return escapedValue;
          }
          
          // Caso 6: Otros tipos (boolean, etc.)
          console.log('Otro tipo de valor:', value);
          return value;
        });
        return `(${values.join(', ')})`;
      });
      
      sql += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n`;
      sql += valuesList.join(',\n');
      sql += ';\n\n';
      
      currentBatch++;
      console.log(`Batch ${currentBatch} procesado: ${batch.length} filas`);
    }
    
    console.log('SQL generado (primeras líneas):', sql.substring(0, 300));
    return sql;
  }

  // Convertir JSON a Excel
  jsonToExcel(jsonData: any[], fileName: string = 'data.xlsx'): void {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, fileName);
  }

  // Dividir Excel en múltiples archivos
  async splitExcelFile(file: File, rowsPerFile: number = 1000): Promise<Blob> {
    const sheets = await this.readExcelFile(file);
    const zip = new JSZip();
    
    sheets.forEach(sheet => {
      const headers = sheet.data[0];
      const rows = sheet.data.slice(1);
      const totalFiles = Math.ceil(rows.length / rowsPerFile);
      
      for (let i = 0; i < totalFiles; i++) {
        const startIndex = i * rowsPerFile;
        const endIndex = Math.min(startIndex + rowsPerFile, rows.length);
        const fileRows = [headers, ...rows.slice(startIndex, endIndex)];
        
        const worksheet = XLSX.utils.aoa_to_sheet(fileRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        zip.file(`${sheet.name}_part_${i + 1}.xlsx`, excelBuffer);
      }
    });
    
    return await zip.generateAsync({ type: 'blob' });
  }

  // Leer archivo JSON
  async readJsonFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // Descargar archivo
  downloadFile(content: string | Blob, fileName: string, mimeType?: string): void {
    if (typeof content === 'string') {
      const blob = new Blob([content], { type: mimeType || 'text/plain' });
      FileSaver.saveAs(blob, fileName);
    } else {
      FileSaver.saveAs(content, fileName);
    }
  }
}