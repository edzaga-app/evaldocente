import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfevaluationComponent } from './selfevaluation.component';

describe('SelfevaluationComponent', () => {
  let component: SelfevaluationComponent;
  let fixture: ComponentFixture<SelfevaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfevaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
