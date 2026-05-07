import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, required } from '@angular/forms/signals';

import { Username } from './username';

@Component({
  imports: [Username],
  template: `<app-username [loginField]="usernameForm.username" />`,
})
class UsernameHost {
  private readonly model = signal({ username: '' });

  protected readonly usernameForm = form(this.model, (schemaPath) => {
    required(schemaPath.username);
  });
}

describe('Username', () => {
  let fixture: ComponentFixture<UsernameHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameHost],
    }).compileComponents();

    fixture = TestBed.createComponent(UsernameHost);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

