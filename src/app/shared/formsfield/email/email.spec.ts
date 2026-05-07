import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, required } from '@angular/forms/signals';

import { Email } from './email';

@Component({
  imports: [Email],
  template: `<app-email [emailField]="emailForm.email" />`,
})
class EmailHost {
  private readonly model = signal({ email: '' });

  protected readonly emailForm = form(this.model, (schemaPath) => {
    required(schemaPath.email);
  });
}

describe('Email', () => {
  let fixture: ComponentFixture<EmailHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailHost],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailHost);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

