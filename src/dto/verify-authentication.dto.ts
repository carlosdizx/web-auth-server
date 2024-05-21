import { IsIn, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResponseDto {
  @IsNotEmpty()
  authenticatorData: string;

  @IsNotEmpty()
  clientDataJSON: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  userHandle: string;
}

export default class VerifyAuthenticationDto {
  @IsIn(['cross-platform', 'platform'])
  authenticatorAttachment: string;

  @IsObject()
  clientExtensionResults: any;

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  rawId: string;

  @ValidateNested()
  @Type(() => ResponseDto)
  response: ResponseDto;

  @IsIn(['public-key'])
  type: string;
}
