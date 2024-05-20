import { Injectable } from '@nestjs/common';
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server';
import GenerateRegisterOptionDto from './dto/generate-register-option.dto';

@Injectable()
export default class AppService {
  private rpName = 'Milio';
  private rpID = 'https://milio.com.co/';

  public generateRegisterOptions = async ({
    userName,
    userDisplayName,
  }: GenerateRegisterOptionDto) => {
    const opts: GenerateRegistrationOptionsOpts = {
      rpName: this.rpName,
      rpID: this.rpID,
      userName,
      userDisplayName,
      timeout: 60000,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'preferred',
      },
      supportedAlgorithmIDs: [-7, -257],
    };
    return await generateRegistrationOptions(opts);
  };
}
