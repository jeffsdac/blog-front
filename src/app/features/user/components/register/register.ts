import { Component, inject, signal } from '@angular/core';
import { Username } from '../../../../shared/formsfield/username/username';
import { Password } from '../../../../shared/formsfield/password/password';
import { IRegisterUserDTO } from '../../model/iregister-user-dto';
import { email, form, maxLength, minLength, required, validate } from '@angular/forms/signals';
import { Email } from '../../../../shared/formsfield/email/email';
import { RouterLink } from '@angular/router';
import { RegisterUserService } from '../../service/register-user-service';
import { Statusmessage } from '../../../../shared/statusmessage/statusmessage';

@Component({
  selector: 'app-register',
  imports: [Username, Password, Email, RouterLink, Statusmessage],
  templateUrl: './register.html',
})
export class Register {
  protected readonly registerUserService = inject(RegisterUserService);

  registerModel = signal<IRegisterUserDTO>({
    email: "",
    username: "",
    password: "",
    confirmedPassword: "",
    firstName: "",
    lastName: "",
  });

  registerModelForm = form( this.registerModel, (schemaPath) => {
    required( schemaPath.email, { message: "O email é mandatório" } ),
    email( schemaPath.email, { message: "Insira um formato válido de email" } ),

    required( schemaPath.username, { message: "O Username é mandatório" } ),
    minLength( schemaPath.username, 5, {message: "Seu username precisa ser maior que 5 dígitos"} ),
    maxLength( schemaPath.username, 50, { message: "Seu username precisa ser menor" } ),

    required( schemaPath.password, { message: "O campo senha é mandatório"} ),
    minLength( schemaPath.password, 10 , { message: "Sua senha precisa ter no mínimo 10 dígitos"} ),

    required( schemaPath.confirmedPassword, { message: "O campo senha é mandatório"} ),
    minLength( schemaPath.confirmedPassword, 10 , { message: "Sua senha precisa ter no mínimo 10 dígitos"} ),
    validate(schemaPath.confirmedPassword, ({value , valueOf}) => {
      const confirmPassword= value();
      const password = valueOf( schemaPath.password );

      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Suas senhas precisam ser iguais',
        };
      }
      return null;
    })

  });

  onSubmit ( event: Event ) : void {
    event.preventDefault();
    this.registerUserService.register(this.registerModel());
  }

}
