import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalRecordFormComponent } from './clinical-record-form.component';

describe('ClinicalRecordFormComponent', () => {
  let component: ClinicalRecordFormComponent;
  let fixture: ComponentFixture<ClinicalRecordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalRecordFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalRecordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
