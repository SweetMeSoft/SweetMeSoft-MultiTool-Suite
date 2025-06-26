import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ExcelToSql } from './pages/excel-to-sql/excel-to-sql';
import { JsonToExcel } from './pages/json-to-excel/json-to-excel';
import { ExcelSplitter } from './pages/excel-splitter/excel-splitter';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'excel-to-sql', component: ExcelToSql },
  { path: 'json-to-excel', component: JsonToExcel },
  { path: 'excel-splitter', component: ExcelSplitter },
  { path: '**', redirectTo: '/home' }
];
