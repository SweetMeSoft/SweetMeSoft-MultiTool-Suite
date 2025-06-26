import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelToSql } from './excel-to-sql';

describe('ExcelToSql', () => {
  let component: ExcelToSql;
  let fixture: ComponentFixture<ExcelToSql>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelToSql]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelToSql);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
