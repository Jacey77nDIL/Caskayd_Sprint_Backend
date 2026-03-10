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

  async create(userId: string, data: any) {
  const existing = await this.repo.findOne({
    where: { user: { id: userId } },
  });

    if (existing) {
      return existing; 
    }

    const profile = this.repo.create({
      ...data,
      user: { id: userId },
    });

    return this.repo.save(profile);
  }

  async updateProfile(userId: string, dto: any) {
  let profile = await this.repo.findOne({
    where: { user: { id: userId } },
  });

  if (!profile) {
    profile = new BusinessProfile();
    profile.user = { id: userId } as any;
    profile.userId = userId; 
  }

  Object.assign(profile, dto);

  return this.repo.save(profile);
 }
}