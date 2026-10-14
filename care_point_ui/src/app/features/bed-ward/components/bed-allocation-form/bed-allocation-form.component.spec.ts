import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedAllocationFormComponent } from './bed-allocation-form.component';

describe('BedAllocationFormComponent', () => {
  let component: BedAllocationFormComponent;
  let fixture: ComponentFixture<BedAllocationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedAllocationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedAllocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
