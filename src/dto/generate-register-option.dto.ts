import { IsEmail, IsNotEmpty } from 'class-validator';

export default class GenerateRegisterOptionDto {
  @IsEmail()
  userName: string;

  @IsNotEmpty()
  userDisplayName: string;
}
