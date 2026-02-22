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

    calculateEngagementRate(
      likes: number,
      comments: number,
      followers: number,
    ): number {
      if (!followers) return 0;
      return ((likes + comments) / followers) * 100;
    }

  async create(data: any) {
    const profile = this.repo.create(data);
    return this.repo.save(profile);
  }

    async addFinance(data: any) {
    const finance = this.financeRepo.create(data);
    return this.financeRepo.save(finance);
    }
 
  async addMetrics(data: any) {
    const engagementRate = this.calculateEngagementRate(
      data.avgLikes,
      data.avgComments,
      data.followers,
    );

    const metrics = this.metricsRepo.create({
      ...data,
      engagementRate,
    });

    return this.metricsRepo.save(metrics);
  }

  async filterCreators(query: any) {
  const qb = this.repo.createQueryBuilder("creator");

  if (query.niche) {
    qb.andWhere("JSON_CONTAINS(creator.niches, :niche)", {
      niche: JSON.stringify(query.niche),
    });
  }

  if (query.minFollowers) {
    qb.andWhere(
      "(creator.instagramFollowers >= :min OR creator.tiktokFollowers >= :min)",
      { min: query.minFollowers }
    );
  }

  if (query.minEngagement) {
    qb.andWhere(
      "(creator.instagramEngagementRate >= :eng OR creator.tiktokEngagementRate >= :eng)",
      { eng: query.minEngagement }
    );
  }

  if (query.maxPrice) {
    qb.leftJoin("creator.finance", "finance")
      .andWhere("finance.pricePerPost <= :price", {
        price: query.maxPrice,
      });
    }

    return qb.getMany();
  }

  async recommendCreators(category: string) {
  const categoryMap = {
    restaurant: ["food", "lifestyle"],
    fashion: ["fashion", "beauty"],
    tech: ["tech", "gadgets"],
    fitness: ["fitness", "health"],
  };

  const niches = categoryMap[category] || [];

  const creators = await this.repo.find({
    relations: ["finance"],
  });

  return creators
    .map((creator) => {
      const nicheMatch = creator.niches?.filter(n =>
        niches.includes(n)
      ).length || 0;

      const followers =
        creator.instagramFollowers + creator.tiktokFollowers;

      const engagement =
        (creator.instagramEngagementRate +
          creator.tiktokEngagementRate) / 2;

      const priceScore =
        creator.pricePerPost !== null && creator.pricePerPost < 150
          ? 10
          : 5;

      const score =
        nicheMatch * 40 +
        engagement * 30 +
        Math.log10(followers + 1) * 20 +
        priceScore * 10;

      return { creator, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  }
}