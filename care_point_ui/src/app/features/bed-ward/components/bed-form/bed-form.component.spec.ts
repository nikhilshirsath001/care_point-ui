import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedFormComponent } from './bed-form.component';

describe('BedFormComponent', () => {
  let component: BedFormComponent;
  let fixture: ComponentFixture<BedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
