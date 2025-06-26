import { Component, inject } from '@angular/core';
import { FileService, ExcelSheet } from '../../services/file-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-excel-splitter',
  templateUrl: './excel-splitter.html',
  styleUrl: './excel-splitter.scss',
  standalone: true,
  providers: [FileService],
  imports: [FormsModule, CommonModule]
})
export class ExcelSplitter {
  fileService = inject(FileService);

  selectedFile: File | null = null;
  fileName: string = '';
  excelSheets: ExcelSheet[] = [];
  isLoading: boolean = false;
  error: string = '';
  rowsPerFile: number = 1000;
  totalRows: number = 0;
  estimatedFiles: number = 0;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.fileName = file.name;
      this.error = '';
      this.excelSheets = [];
      this.totalRows = 0;
      this.estimatedFiles = 0;
      
      // Cargar automáticamente el archivo
      this.cargarExcel();
    }
  }

  async cargarExcel() {
    if (!this.selectedFile) {
      this.error = 'Por favor selecciona un archivo Excel.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      this.excelSheets = await this.fileService.readExcelFile(this.selectedFile);
      this.calcularTotalFilas();
      this.calcularArchivosEstimados();
      this.error = '';
    } catch {
      this.error = 'Error al leer el archivo Excel. Asegúrate de que sea un archivo válido.';
      this.excelSheets = [];
      this.totalRows = 0;
      this.estimatedFiles = 0;
    } finally {
      this.isLoading = false;
    }
  }

  calcularTotalFilas() {
    this.totalRows = this.excelSheets.reduce((total, sheet) => {
      // Restar 1 porque la primera fila son los headers
      return total + Math.max(0, sheet.data.length - 1);
    }, 0);
  }

  calcularArchivosEstimados() {
    this.estimatedFiles = this.excelSheets.reduce((total, sheet) => {
      const dataRows = Math.max(0, sheet.data.length - 1);
      return total + Math.ceil(dataRows / this.rowsPerFile);
    }, 0);
  }

  onRowsPerFileChange() {
    if (this.rowsPerFile < 1) {
      this.rowsPerFile = 1;
    }
    if (this.rowsPerFile > 100000) {
      this.rowsPerFile = 100000;
    }
    this.calcularArchivosEstimados();
  }

  async dividirExcel() {
    if (!this.selectedFile || this.excelSheets.length === 0) {
      this.error = 'No hay archivo Excel cargado para dividir.';
      return;
    }

    if (this.estimatedFiles > 50) {
      const confirmar = confirm(`Se generarán ${this.estimatedFiles} archivos. ¿Estás seguro de continuar?`);
      if (!confirmar) {
        return;
      }
    }

    this.isLoading = true;
    this.error = '';

    try {
      const zipBlob = await this.fileService.splitExcelFile(this.selectedFile, this.rowsPerFile);
      const zipFileName = this.fileName.replace(/\.(xlsx|xls)$/i, '_dividido.zip');
      this.fileService.downloadFile(zipBlob, zipFileName);
      
      // Mantener el botón deshabilitado por un tiempo
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
      
    } catch {
      this.error = 'Error al dividir el archivo Excel. El archivo podría ser demasiado grande o estar corrupto.';
      this.isLoading = false;
    }
  }

  limpiar() {
    this.selectedFile = null;
    this.fileName = '';
    this.excelSheets = [];
    this.error = '';
    this.totalRows = 0;
    this.estimatedFiles = 0;
    this.rowsPerFile = 1000;
    
    // Limpiar el input de archivo
    const fileInput = document.getElementById('excelFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
