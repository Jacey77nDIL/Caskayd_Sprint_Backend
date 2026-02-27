import { Body, Controller, Post, Req, Get, Query } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Request } from 'express';


@Controller('creator')
export class CreatorController {
  constructor(private creatorService: CreatorService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Req() req: any, @Body() body: any) {
      //console.log("USER:", req.user);
      return this.creatorService.create(req.user.sub, body);
    }

   @Post('finance')
    @UseGuards(JwtAuthGuard)
    addFinance(@Req() req: any, @Body() body: any) {
      console.log("FINANCE BODY:", body); 
      return this.creatorService.addFinance(req.user.sub, body);
    }

    @Post('metrics')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    addMetrics(@Body() body: any) {
      return this.creatorService.addMetrics(body);
    }

    @Get()
    getCreators(@Query() query: any) {
      return this.creatorService.filterCreators(query);
    }

    @Get('recommended')
    getRecommended(@Query('category') category: string) {
      return this.creatorService.recommendCreators(category);
    }

    @Post("complete-profile")
  async completeProfile(
    @Req() req,
    @Body() body,
  ) {
    return this.creatorService.completeProfile(
      req.user.id,
      body.bankCode,
      body.accountNumber,
    );
  }
}