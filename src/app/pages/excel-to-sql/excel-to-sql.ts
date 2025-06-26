import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileService, ExcelSheet } from '../../services/file-service';

@Component({
  selector: 'app-excel-to-sql',
  imports: [FormsModule, CommonModule],
  templateUrl: './excel-to-sql.html',
  styleUrl: './excel-to-sql.scss'
})
export class ExcelToSql {
  excelSheets: ExcelSheet[] = [];
  selectedSheet: ExcelSheet | null = null;
  tableName: string = '';
  batchSize: number = 1000;
  treatEmptyAsNull: boolean = true;
  sqlResult: string = '';
  isDragOver: boolean = false;
  isLoading: boolean = false;
  Math = Math; // Para usar Math en el template

  constructor(private fileService: FileService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  async processFile(file: File) {
    this.isLoading = true;
    try {
      this.excelSheets = await this.fileService.readExcelFile(file);
      if (this.excelSheets.length > 0) {
        this.selectedSheet = this.excelSheets[0];
        this.tableName = this.generateTableName(file.name);
      }
      this.sqlResult = '';
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      alert('Error al procesar el archivo. Asegúrate de que sea un archivo Excel válido.');
    } finally {
      this.isLoading = false;
    }
  }

  generateTableName(fileName: string): string {
    return fileName.replace(/\.(xlsx|xls)$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  onSheetChange() {
    this.sqlResult = '';
  }

  generateSQL() {
    console.log('generateSQL() llamado');
    console.log('tableName:', this.tableName);
    console.log('selectedSheet:', this.selectedSheet);
    console.log('selectedSheet.data:', this.selectedSheet?.data);
    console.log('selectedSheet.data.length:', this.selectedSheet?.data?.length);
    console.log('batchSize:', this.batchSize);
    console.log('treatEmptyAsNull:', this.treatEmptyAsNull);
    
    if (this.tableName && this.selectedSheet && this.selectedSheet.data.length > 0) {
      console.log('Generando SQL...');
      this.sqlResult = this.fileService.excelToSqlInsert(
        this.selectedSheet.data, 
        this.tableName, 
        this.batchSize, 
        this.treatEmptyAsNull
      );
      console.log('SQL generado:', this.sqlResult);
    } else {
      console.log('No se puede generar SQL - condiciones no cumplidas');
      console.log('tableName válido:', !!this.tableName);
      console.log('selectedSheet válido:', !!this.selectedSheet);
      console.log('data válido:', !!(this.selectedSheet?.data && this.selectedSheet.data.length > 0));
    }
  }

  clearData() {
    this.excelSheets = [];
    this.selectedSheet = null;
    this.tableName = '';
    this.batchSize = 1000;
    this.treatEmptyAsNull = true;
    this.sqlResult = '';
  }

  downloadSQL() {
    if (this.sqlResult) {
      const fileName = `${this.tableName}_insert.sql`;
      this.fileService.downloadFile(this.sqlResult, fileName, 'text/plain');
    }
  }

  async copyToClipboard() {
    if (this.sqlResult) {
      try {
        await navigator.clipboard.writeText(this.sqlResult);
        alert('SQL copiado al portapapeles');
      } catch (error) {
        console.error('Error al copiar:', error);
        alert('Error al copiar al portapapeles');
      }
    }
  }

  getPreviewData() {
    if (!this.selectedSheet || this.selectedSheet.data.length === 0) return [];
    return this.selectedSheet.data.slice(1, 6); // Primeras 5 filas de datos
  }

  getHeaders() {
    if (!this.selectedSheet || this.selectedSheet.data.length === 0) return [];
    return this.selectedSheet.data[0] || [];
  }

  getRowCount(): number {
    if (!this.selectedSheet || !this.selectedSheet.data || this.selectedSheet.data.length === 0) return 0;
    return this.selectedSheet.data.length - 1; // Restamos 1 para excluir la fila de encabezados
  }

  getBatchCount(): number {
    const rowCount = this.getRowCount();
    return Math.ceil(rowCount / this.batchSize);
  }

  testButton() {
    console.log('Botón clickeado - test');
    console.log('Estado del botón:');
    console.log('- tableName:', this.tableName);
    console.log('- selectedSheet:', this.selectedSheet);
    console.log('- Botón habilitado:', !!(this.tableName && this.selectedSheet));
    this.generateSQL();
  }
}
