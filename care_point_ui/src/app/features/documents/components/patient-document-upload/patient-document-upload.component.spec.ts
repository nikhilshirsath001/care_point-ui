import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDocumentUploadComponent } from './patient-document-upload.component';

describe('PatientDocumentUploadComponent', () => {
  let component: PatientDocumentUploadComponent;
  let fixture: ComponentFixture<PatientDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDocumentUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
