import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryFormComponent } from './service-category-form.component';

describe('ServiceCategoryFormComponent', () => {
  let component: ServiceCategoryFormComponent;
  let fixture: ComponentFixture<ServiceCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCategoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
