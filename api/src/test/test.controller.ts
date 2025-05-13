import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  ping() {
    return { message: 'pong' };
  }
}
