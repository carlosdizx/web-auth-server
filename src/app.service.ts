import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
  VerifyRegistrationResponseOpts,
  generateAuthenticationOptions,
  GenerateAuthenticationOptionsOpts,
} from '@simplewebauthn/server';
import GenerateRegisterOptionDto from './dto/generate-register-option.dto';
import type { RegistrationResponseJSON } from '@simplewebauthn/types';
import VerifyRegisterDto from './dto/verify-register.dto';

@Injectable()
export default class AppService {
  private readonly challenge = 'ENAJZPS7vP27ZRaxOtmZUf1mZAHOlHvhu3hWcOgNymg';

  private readonly origin = 'http://localhost:4200';

  private readonly rpName = 'Milio';

  private readonly rpID = 'localhost';

  public generateRegisterOptions = async ({
    userName,
    userDisplayName,
  }: GenerateRegisterOptionDto) => {
    const opts: GenerateRegistrationOptionsOpts = {
      rpName: this.rpName,
      rpID: this.rpID,
      challenge: this.challenge,
      userName,
      userDisplayName,
      timeout: 60000,
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'preferred',
      },
      supportedAlgorithmIDs: [-7, -257],
    };
    try {
      return await generateRegistrationOptions(opts);
    } catch (error) {
      throw new InternalServerErrorException(
        'ERROR generating options for registration',
      );
    }
  };

  public verifyUserRegistration = async (dto: VerifyRegisterDto) => {
    const responseJSON: RegistrationResponseJSON = dto as any;

    const [expectedChallenge] = btoa(this.challenge).split('==');

    const opts: VerifyRegistrationResponseOpts = {
      response: responseJSON,
      expectedChallenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
      requireUserVerification: false,
    };

    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationResponse(opts);
    } catch (error) {
      throw new ConflictException('Could not verify registration');
    }
    const { verified } = verification;
    if (verified) return { message: 'User register' };
    throw new ConflictException('Error user not verified');
  };

  public generateAuthenticationOptions = async () => {
    const opts: GenerateAuthenticationOptionsOpts = {
      timeout: 60000,
      userVerification: 'preferred',
      rpID: this.rpID,
      challenge: this.challenge,
    };

    try {
      return await generateAuthenticationOptions(opts);
    } catch (error) {
      throw new InternalServerErrorException(
        'ERROR generating options for registration',
      );
    }
  };
}
