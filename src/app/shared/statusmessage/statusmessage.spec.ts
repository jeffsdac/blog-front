import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Statusmessage } from './statusmessage';

describe('Statusmessage', () => {
  let component: Statusmessage;
  let fixture: ComponentFixture<Statusmessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statusmessage],
    }).compileComponents();

    fixture = TestBed.createComponent(Statusmessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
