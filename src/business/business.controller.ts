import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('business')
export class BusinessController {
  constructor(private service: BusinessService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user.sub, body);
  }
}