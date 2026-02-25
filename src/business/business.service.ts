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

  async updateProfile(userId: string, dto: any) {
  let profile = await this.repo.findOne({
    where: { user: { id: userId } },
  });

  if (!profile) {
    profile = new BusinessProfile();
    profile.user = { id: userId } as any;
  }

  Object.assign(profile, dto);

  return this.repo.save(profile);
 }
}