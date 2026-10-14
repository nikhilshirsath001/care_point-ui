import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressEntryFormComponent } from './progress-entry-form.component';

describe('ProgressEntryFormComponent', () => {
  let component: ProgressEntryFormComponent;
  let fixture: ComponentFixture<ProgressEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressEntryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
