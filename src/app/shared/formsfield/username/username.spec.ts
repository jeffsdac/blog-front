import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Username } from './username';

describe('Username', () => {
  let component: Username;
  let fixture: ComponentFixture<Username>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Username],
    }).compileComponents();

    fixture = TestBed.createComponent(Username);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
