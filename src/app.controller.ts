import { Body, Controller, Post } from '@nestjs/common';
import AppService from './app.service';
import CreateAuthenticationDto from './dto/register-device.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register-device')
  async registerDevice(@Body() dto: CreateAuthenticationDto) {
    return await this.appService.registerDevice(dto);
  }
}
