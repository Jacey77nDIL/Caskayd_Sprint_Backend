import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

 async findByEmail(email: string) {
  return this.repo.findOne({
      where: { email },
      select: ["id", "email", "password", "role"],
    });
  }

  async findById(id: string, includePassword = false) {
  if (includePassword) {
      return this.repo.findOne({
        where: { id },
        select: ["id", "email", "password", "role"],
      });
    }

    return this.repo.findOne({
      where: { id },
    });
  }

  async updatePassword(id: string, password: string) {
  await this.repo.update(id, { password });
  }

   async updateAvatar(userId: string, url: string) {
    const user = await this.repo.findOne({ where: { id: userId } });

    if (!user) {
        throw new NotFoundException('User not found');
      }

      user.avatar = url;

      await this.repo.save(user);

      return { avatar: url };
    }

    async update(id: string, data: Partial<User>) {
  await this.repo.update(id, data);
  return this.repo.findOne({ where: { id } });
 }

 async getMarketplaceProfiles() {
  const users = await this.repo
    .createQueryBuilder("user")
    .leftJoin("creator_profile", "creator", "creator.userId = user.id")
    .leftJoin("business_profile", "business", "business.userId = user.id")
    .select([
      "user.id AS id",
      "user.email AS email",
      "user.avatar AS avatar",
      "creator.displayName AS displayName",
      "business.businessName AS businessName",
    ])
    .getRawMany();

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    avatar: u.avatar,

    displayName: u.displayName || null,
    businessName: u.businessName || null,
  }));
}
  }