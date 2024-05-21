import { Body, Controller, Get, Post } from '@nestjs/common';
import AppService from './app.service';
import GenerateRegisterOptionDto from './dto/generate-register-option.dto';
import VerifyRegisterDto from './dto/verify-register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate-register-options')
  public async generateRegisterOptions(@Body() dto: GenerateRegisterOptionDto) {
    return await this.appService.generateRegisterOptions(dto);
  }

  @Post('verify-register-options')
  public async registerDevice(@Body() dto: VerifyRegisterDto) {
    return this.appService.verifyUserRegistration(dto);
  }

  @Get('generate-authentication-options')
  public async generateAuthenticationOptions() {
    return this.appService.generateAuthenticationOptions();
  }
}
