import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientFormComponent } from './inpatient-form.component';

describe('InpatientFormComponent', () => {
  let component: InpatientFormComponent;
  let fixture: ComponentFixture<InpatientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InpatientFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
