import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatorProfile } from './creator.entity';
import { Repository } from 'typeorm';
import { CreatorFinance } from './creator-finance.entity';  
import { CreatorMetrics } from './creator-metrics.entity';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(CreatorProfile)
    private repo: Repository<CreatorProfile>,

    @InjectRepository(CreatorFinance)
    private financeRepo: Repository<CreatorFinance>,

    @InjectRepository(CreatorMetrics)
    private metricsRepo: Repository<CreatorMetrics>,

  ) {}

  async create(data: any) {
    const profile = this.repo.create(data);
    return this.repo.save(profile);
  }

    async addFinance(data: any) {
    const finance = this.financeRepo.create(data);
    return this.financeRepo.save(finance);
    }
 
    async addMetrics(data: any) {
    const metrics = this.metricsRepo.create(data);
    return this.metricsRepo.save(metrics);
    }
}