import { Component, inject, signal } from '@angular/core';
import { ILoginDTO } from '../models/ilogin-dto';
import { form, required, min, minLength, maxLength, FormField } from '@angular/forms/signals';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
})
export class Login {
  protected readonly loginService = inject(LoginService);

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

}
