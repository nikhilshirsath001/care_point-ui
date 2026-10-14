import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientDetailsComponent } from './inpatient-details.component';

describe('InpatientDetailsComponent', () => {
  let component: InpatientDetailsComponent;
  let fixture: ComponentFixture<InpatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InpatientDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
