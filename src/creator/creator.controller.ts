import { Body, Controller, Post } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('creator')
export class CreatorController {
  constructor(private creatorService: CreatorService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() body: any) {
        return this.creatorService.create(body);
    }

    @Post('finance')
    @UseGuards(JwtAuthGuard)
    addFinance(@Body() body: any) {
    return this.creatorService.addFinance(body);
    }

    @Post('metrics')
    @UseGuards(JwtAuthGuard)
    addMetrics(@Body() body: any) {
    return this.creatorService.addMetrics(body);
    }
}