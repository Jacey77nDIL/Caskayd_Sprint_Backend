import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from './creator.entity';
import { CreatorFinance} from './creator-finance.entity';
import { CreatorMetrics } from './creator-metrics.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CreatorProfile, CreatorFinance, CreatorMetrics,])],
  providers: [CreatorService],
  controllers: [CreatorController]
})
export class CreatorModule {}
