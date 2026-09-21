import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeSummaryFormComponent } from './discharge-summary-form.component';

describe('DischargeSummaryFormComponent', () => {
  let component: DischargeSummaryFormComponent;
  let fixture: ComponentFixture<DischargeSummaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DischargeSummaryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DischargeSummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
