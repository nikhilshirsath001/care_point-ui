import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDetailsComponent } from './shared-details.component';

describe('SharedDetailsComponent', () => {
  let component: SharedDetailsComponent;
  let fixture: ComponentFixture<SharedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
