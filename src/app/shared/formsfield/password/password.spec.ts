import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, required } from '@angular/forms/signals';

import { Password } from './password';

@Component({
  imports: [Password],
  template: `<app-password [passwordField]="passwordForm.password" label="Senha" inputId="password" />`,
})
class PasswordHost {
  private readonly model = signal({ password: '' });

  protected readonly passwordForm = form(this.model, (schemaPath) => {
    required(schemaPath.password);
  });
}

describe('Password', () => {
  let fixture: ComponentFixture<PasswordHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordHost],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordHost);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

