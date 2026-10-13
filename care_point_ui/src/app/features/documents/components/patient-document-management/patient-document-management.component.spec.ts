import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDocumentManagementComponent } from './patient-document-management.component';

describe('PatientDocumentManagementComponent', () => {
  let component: PatientDocumentManagementComponent;
  let fixture: ComponentFixture<PatientDocumentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDocumentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDocumentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
