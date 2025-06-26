import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelSplitter } from './excel-splitter';

describe('ExcelSplitter', () => {
  let component: ExcelSplitter;
  let fixture: ComponentFixture<ExcelSplitter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelSplitter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelSplitter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
