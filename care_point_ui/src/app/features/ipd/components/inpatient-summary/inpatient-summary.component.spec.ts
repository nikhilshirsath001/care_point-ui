import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientSummaryComponent } from './inpatient-summary.component';

describe('InpatientSummaryComponent', () => {
  let component: InpatientSummaryComponent;
  let fixture: ComponentFixture<InpatientSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InpatientSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpatientSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
