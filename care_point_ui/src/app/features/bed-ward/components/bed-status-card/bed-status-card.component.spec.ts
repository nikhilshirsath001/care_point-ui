import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedStatusCardComponent } from './bed-status-card.component';

describe('BedStatusCardComponent', () => {
  let component: BedStatusCardComponent;
  let fixture: ComponentFixture<BedStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedStatusCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
