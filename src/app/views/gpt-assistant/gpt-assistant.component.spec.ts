import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GptAssistantComponent } from './gpt-assistant.component';

describe('GptAssistantComponent', () => {
  let component: GptAssistantComponent;
  let fixture: ComponentFixture<GptAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GptAssistantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GptAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
