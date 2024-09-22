import { Auth } from './domain';
import { AuthLoginBody } from './contracts';

export class AuthMapper {

  static mapDomainToAuthLoginBody(data: Auth): AuthLoginBody {
    return {
      uname: data.username,
      pass: data.password
    };
  }
}
