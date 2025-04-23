import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlikSheetComponent } from './qlik-sheet.component';

describe('QlikSheetComponent', () => {
  let component: QlikSheetComponent;
  let fixture: ComponentFixture<QlikSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QlikSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QlikSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
