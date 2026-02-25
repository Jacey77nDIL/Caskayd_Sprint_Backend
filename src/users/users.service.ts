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

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string) {
  return this.repo.findOne({ where: { id } });
  }

  async updatePassword(id: string, password: string) {
  await this.repo.update(id, { password });
  }

   async updateAvatar(userId: string, url: string) {
    const user = await this.repo.findOne({ where: { id: userId } });

    if (!user) {
        throw new NotFoundException('User not found');
      }

      user.profilePicture = url;

      await this.repo.save(user);

      return { profilePicture: url };
    }
  }