import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartoForm } from './reparto-form';

describe('RepartoForm', () => {
  let component: RepartoForm;
  let fixture: ComponentFixture<RepartoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepartoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepartoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
