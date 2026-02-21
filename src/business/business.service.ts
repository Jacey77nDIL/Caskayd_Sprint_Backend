import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessProfile } from './business.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessProfile)
    private repo: Repository<BusinessProfile>,
  ) {}

  create(data: any) {
    const profile = this.repo.create(data);
    return this.repo.save(profile);
  }
}