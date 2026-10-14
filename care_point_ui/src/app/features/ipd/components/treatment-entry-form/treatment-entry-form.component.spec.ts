import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentEntryFormComponent } from './treatment-entry-form.component';

describe('TreatmentEntryFormComponent', () => {
  let component: TreatmentEntryFormComponent;
  let fixture: ComponentFixture<TreatmentEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentEntryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
