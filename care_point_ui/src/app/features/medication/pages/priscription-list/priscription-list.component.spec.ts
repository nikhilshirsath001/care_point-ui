import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriscriptionListComponent } from './priscription-list.component';

describe('PriscriptionListComponent', () => {
  let component: PriscriptionListComponent;
  let fixture: ComponentFixture<PriscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriscriptionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
