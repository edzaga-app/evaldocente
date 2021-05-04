import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoevaluationComponent } from './coevaluation.component';

describe('CoevaluationComponent', () => {
  let component: CoevaluationComponent;
  let fixture: ComponentFixture<CoevaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoevaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
