import { Body, Controller, Post } from '@nestjs/common';
import AppService from './app.service';
import GenerateRegisterOptionDto from './dto/generate-register-option.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate-register-options')
  public async registerDevice(@Body() dto: GenerateRegisterOptionDto) {
    return await this.appService.generateRegisterOptions(dto);
  }
}
