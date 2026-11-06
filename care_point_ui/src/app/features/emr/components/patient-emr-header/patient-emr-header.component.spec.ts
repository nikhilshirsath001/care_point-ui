import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEmrHeaderComponent } from './patient-emr-header.component';

describe('PatientEmrHeaderComponent', () => {
  let component: PatientEmrHeaderComponent;
  let fixture: ComponentFixture<PatientEmrHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientEmrHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientEmrHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
