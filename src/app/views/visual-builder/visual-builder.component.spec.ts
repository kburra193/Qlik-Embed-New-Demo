import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualBuilderComponent } from './visual-builder.component';

describe('VisualBuilderComponent', () => {
  let component: VisualBuilderComponent;
  let fixture: ComponentFixture<VisualBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
