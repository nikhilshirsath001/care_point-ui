import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientListComponent } from './inpatient-list.component';

describe('InpatientListComponent', () => {
  let component: InpatientListComponent;
  let fixture: ComponentFixture<InpatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InpatientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
