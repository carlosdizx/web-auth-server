import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CredPropsDto {
  @IsBoolean()
  rk: boolean;
}

class ClientExtensionResultsDto {
  @ValidateNested()
  @Type(() => CredPropsDto)
  credProps: CredPropsDto;
}

class ResponseDto {
  @IsNotEmpty()
  attestationObject: string;

  @IsNotEmpty()
  clientDataJSON: string;

  @IsArray()
  @ArrayNotEmpty()
  transports: string[];

  @IsInt()
  publicKeyAlgorithm: number;

  @IsNotEmpty()
  publicKey: string;

  @IsNotEmpty()
  authenticatorData: string;
}

export default class VerifyRegisterDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  rawId: string;

  @ValidateNested()
  @Type(() => ResponseDto)
  response: ResponseDto;

  @IsIn(['public-key'])
  type: string;

  @ValidateNested()
  @Type(() => ClientExtensionResultsDto)
  clientExtensionResults: ClientExtensionResultsDto;

  @IsIn(['cross-platform', 'platform'])
  authenticatorAttachment: string;
}
