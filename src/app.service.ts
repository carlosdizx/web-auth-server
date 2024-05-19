import { Injectable, InternalServerErrorException } from '@nestjs/common';
import CreateAuthenticationDto from './dto/register-device.dto';
import { server } from '@passwordless-id/webauthn';

@Injectable()
export default class AppService {
  private readonly challenge = 'a7c61ef9-dc23-4806-b486-2428938a547e';

  private serverAuth = server;

  public registerDevice = async (dto: CreateAuthenticationDto) => {
    try {
      return await this.serverAuth.verifyRegistration(dto, {
        challenge: this.challenge,
        origin: 'http://localhost:4200',
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  };
}
