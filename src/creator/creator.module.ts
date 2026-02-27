import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from './creator.entity';
import { CreatorFinance} from './creator-finance.entity';
import { CreatorMetrics } from './creator-metrics.entity';
import { User } from '../users/user.entity';
import { PaymentsModule } from '../payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorProfile, CreatorFinance, CreatorMetrics, User]), PaymentsModule],
  providers: [CreatorService],
  controllers: [CreatorController],
  exports: [CreatorService]
})
export class CreatorModule {}
