import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CredentialDto {
  @Length(43, 43)
  id: string;

  @MinLength(5)
  publicKey: string;

  @IsIn(['ES256', 'RS256'])
  algorithm: 'ES256' | 'RS256';
}

export default class CreateAuthenticationDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  authenticatorData: string;

  @IsNotEmpty()
  clientData: string;

  @IsNotEmpty()
  attestationData: string;

  @ValidateNested()
  @Type(() => CredentialDto)
  credential: CredentialDto;
}
