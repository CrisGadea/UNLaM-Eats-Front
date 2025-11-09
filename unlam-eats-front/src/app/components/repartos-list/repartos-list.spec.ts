import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartosList } from './repartos-list';

describe('RepartosList', () => {
  let component: RepartosList;
  let fixture: ComponentFixture<RepartosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepartosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepartosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
