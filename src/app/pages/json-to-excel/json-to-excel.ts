import { Component, inject } from '@angular/core';
import { FileService } from '../../services/file-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-to-excel',
  templateUrl: './json-to-excel.html',
  styleUrl: './json-to-excel.scss',
  standalone: true,
  providers: [FileService],
  imports: [FormsModule, CommonModule]
})
export class JsonToExcel {
  fileService = inject(FileService);

  // Exposer Array y Object para usar en el template
  Array = Array;
  Object = Object;

  jsonText: string = '';
  jsonData: any = null;
  error: string = '';
  isLoading: boolean = false;
  isProcessed: boolean = false;
  fileName: string = '';
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.error = '';
      this.jsonData = null;
      this.jsonText = '';
      
      // Cargar automáticamente el archivo
      this.cargarArchivo(file);
    }
  }

  async cargarArchivo(file?: File) {
    const archivoACargar = file || this.selectedFile;
    
    if (!archivoACargar) {
      this.error = 'Por favor selecciona un archivo JSON.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      const data = await this.fileService.readJsonFile(archivoACargar);
      this.jsonData = data;
      this.jsonText = JSON.stringify(data, null, 2);
      this.error = '';
    } catch {
      this.error = 'El archivo no es un JSON válido.';
      this.jsonData = null;
      this.jsonText = '';
    } finally {
      this.isLoading = false;
    }
  }

  onJsonTextChange(text: string) {
    this.jsonText = text;
    this.selectedFile = null;
    this.fileName = '';
    
    if (!text.trim()) {
      this.jsonData = null;
      this.error = '';
      return;
    }
    
    try {
      this.jsonData = JSON.parse(text);
      this.error = '';
    } catch {
      this.jsonData = null;
      this.error = 'El texto no es un JSON válido.';
    }
  }

  descargarExcel() {
    if (!this.jsonData) {
      this.error = 'No hay datos JSON procesados para convertir.';
      return;
    }

    if (!Array.isArray(this.jsonData)) {
      this.error = 'El JSON debe ser un array de objetos para convertir a Excel.';
      return;
    }

    if (this.jsonData.length === 0) {
      this.error = 'El array JSON está vacío.';
      return;
    }

    // Mostrar advertencia para archivos grandes
    if (this.jsonData.length > 10000) {
      const confirmar = confirm(`Este archivo tiene ${this.jsonData.length} registros. Archivos grandes pueden tardar en procesarse o causar problemas de memoria. ¿Deseas continuar?`);
      if (!confirmar) {
        return;
      }
    }

    this.isLoading = true;
    this.error = '';

    // Usar setTimeout para no bloquear la UI y dar tiempo para la descarga
    setTimeout(() => {
      try {
        const nombreArchivo = this.fileName ? 
          this.fileName.replace('.json', '.xlsx') : 
          'datos.xlsx';
        
        this.fileService.jsonToExcel(this.jsonData, nombreArchivo);
        this.error = '';
        
        // Dar tiempo adicional para que la descarga se complete
        setTimeout(() => {
          this.isLoading = false;
        }, this.jsonData.length > 10000 ? 3000 : 1500);
        
      } catch {
        this.error = 'Error al generar el archivo Excel. El archivo podría ser demasiado grande para procesar.';
        this.isLoading = false;
      }
    }, 200);
  }

  limpiar() {
    this.jsonText = '';
    this.jsonData = null;
    this.error = '';
    this.isProcessed = false;
    this.fileName = '';
    this.selectedFile = null;
    
    // Limpiar el input de archivo
    const fileInput = document.getElementById('jsonFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
