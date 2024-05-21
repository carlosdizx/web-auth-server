import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  generateAuthenticationOptions,
  GenerateAuthenticationOptionsOpts,
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  VerifiedRegistrationResponse,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
  verifyRegistrationResponse,
  VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server';
import GenerateRegisterOptionDto from './dto/generate-register-option.dto';
import VerifyRegisterDto from './dto/verify-register.dto';
import VerifyAuthenticationDto from './dto/verify-authentication.dto';
import { VerifiedAuthenticationResponse } from '@simplewebauthn/server/esm/authentication/verifyAuthenticationResponse';
import type { AuthenticatorDevice } from '@simplewebauthn/types';

@Injectable()
export default class AppService {
  private readonly challenge = 'ENAJZPS7vP27ZRaxOtmZUf1mZAHOlHvhu3hWcOgNymg';

  private readonly origin = 'http://localhost:4200';

  private readonly rpName = 'Milio';

  private readonly rpID = 'localhost';

  private readonly devices: AuthenticatorDevice[] = [];

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
    const [expectedChallenge] = btoa(this.challenge).split('==');

    const opts: VerifyRegistrationResponseOpts = {
      response: dto as any,
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
    const { verified, registrationInfo } = verification;
    if (!verified || !registrationInfo)
      throw new ConflictException('Error user not register');

    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const device: AuthenticatorDevice = {
      credentialPublicKey,
      credentialID,
      counter,
      transports: dto.response.transports as any,
    };
    this.devices.push(device);

    return { message: 'User register', ...registrationInfo };
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

  public verifyAuthentication = async (dto: VerifyAuthenticationDto) => {
    const [expectedChallenge] = btoa(this.challenge).split('==');

    const device: AuthenticatorDevice = {} as any;
    const opts: VerifyAuthenticationResponseOpts = {
      authenticator: device,
      response: dto as any,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
    };

    let verification: VerifiedAuthenticationResponse;
    try {
      verification = await verifyAuthenticationResponse(opts);
    } catch (error) {
      console.log();
      throw new InternalServerErrorException('ERROR in verification user');
    }

    const { verified } = verification;

    if (verified) return { message: 'User authenticated' };
    throw new ConflictException('Error user not authenticated');
  };
}
