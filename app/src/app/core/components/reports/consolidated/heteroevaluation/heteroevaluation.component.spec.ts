import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeteroevaluationComponent } from './heteroevaluation.component';

describe('HeteroevaluationComponent', () => {
  let component: HeteroevaluationComponent;
  let fixture: ComponentFixture<HeteroevaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeteroevaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeteroevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
