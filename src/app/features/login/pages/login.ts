import { Component, effect, inject, signal } from '@angular/core';
import { ILoginDTO } from '../models/ilogin-dto';
import { form, required, minLength, maxLength, FormField } from '@angular/forms/signals';
import { LoginService } from '../service/login.service';
import { Username } from '../../../shared/formsfield/username/username';
import { Password } from '../../../shared/formsfield/password/password';
import { Statusmessage } from '../../../shared/statusmessage/statusmessage';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Username, Password, Statusmessage, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  protected readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly hasRedirected = signal(false);

  loginModel = signal<ILoginDTO>({
    username: '',
    password: ''
  });

  LoginModelForm = form(this.loginModel, (schemaPath) =>{
    required( schemaPath.username, { message: "Campo obrigatório" } ),
    minLength( schemaPath.username, 5, { message: "Tamanho mínimo é de 5 caracteres" } ),
    maxLength( schemaPath.username , 100, { message: "Tamanho máximo é de 100 caractéres" } ),

    required( schemaPath.password, { message:  "Campo obrigatório"} ),
    minLength( schemaPath.password, 10 , {message: "Senha precisa ter pelo menos 10 caractéres" } ),
    maxLength( schemaPath.password, 300, { message: "Senha pode ter no máximo 300 caractéres" } )
  }) 

  onSubmit ( event: Event ) {
    event.preventDefault();
    this.loginService.doLogin(this.loginModel());
  }

  constructor() {
    effect(() => {
      if (this.hasRedirected()) return;
      if (this.loginService.status() === 'success') {
        this.hasRedirected.set(true);
        void this.router.navigateByUrl('/');
      }
    });
  }
}
