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
      return this.creatorService.create({
        ...body,
        user: req.user,
      });
    }

    @Post('finance')
    @UseGuards(JwtAuthGuard)
    addFinance(@Body() body: any) {
    return this.creatorService.addFinance(body);
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
}