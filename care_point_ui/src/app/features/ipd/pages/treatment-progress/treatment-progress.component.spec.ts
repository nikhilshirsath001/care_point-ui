import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentProgressComponent } from './treatment-progress.component';

describe('TreatmentProgressComponent', () => {
  let component: TreatmentProgressComponent;
  let fixture: ComponentFixture<TreatmentProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
