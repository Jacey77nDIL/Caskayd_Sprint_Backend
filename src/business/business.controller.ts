import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@Controller('business')
export class BusinessController {
  constructor(private service: BusinessService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("business")
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user.sub, body);
  }
}