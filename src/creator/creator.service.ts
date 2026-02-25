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

  async create(userId: string, data: any) {
    // check if profile exists
    const existing = await this.repo.findOne({
      where: { user: { id: userId } },
    });

    if (existing) {
      Object.assign(existing, data);
      return this.repo.save(existing);
    }

    // create new profile
    const profile = this.repo.create({
      ...data,
      user: { id: userId },   
    });

    return this.repo.save(profile);
  }

  async addFinance(userId: string, data: any) {
    const creator = await this.repo.findOne({
      where: { user: { id: userId } },
    });

    if (!creator) {
      throw new Error("Creator profile not found");
    }

    const finance = this.financeRepo.create({
      ...data,
      creator,
    });

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

  await this.metricsRepo.save(metrics);

  //sync profile
   if (data.platform === "instagram") {
    await this.repo.update(data.creator.id, {
      instagramFollowers: data.followers,
      instagramEngagementRate: engagementRate,
    });
  }

  if (data.platform === "tiktok") {
    await this.repo.update(data.creator.id, {
      tiktokFollowers: data.followers,
      tiktokEngagementRate: engagementRate,
    });
  }

  return metrics;
}


  async filterCreators(query: any) {
  const qb = this.repo
  .createQueryBuilder("creator")
  .leftJoinAndSelect("creator.user", "user");

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

    const creators = await qb.getMany();

    return creators.map(c => ({
      profileId: c.id,
      userId: c.user.id,
      bio: c.bio,
      niches: c.niches,
      instagramFollowers: c.instagramFollowers,
      tiktokFollowers: c.tiktokFollowers,
      instagramEngagementRate: c.instagramEngagementRate,
      tiktokEngagementRate: c.tiktokEngagementRate,
    }));
  }

 async updateProfile(userId: string, dto: any) {
  let profile = await this.repo.findOne({
    where: { user: { id: userId } },
  });

  if (!profile) {
    profile = new CreatorProfile();   // create instance safely
    profile.user = { id: userId } as any;
  }

  Object.assign(profile, dto);

  return this.repo.save(profile);
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
  relations: ["finance", "user"],
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

    return {
      score,

      // IMPORTANT ADDITIONS
      profileId: creator.id,
      userId: creator.user.id,

      bio: creator.bio,
      niches: creator.niches,
      pricePerPost: creator.pricePerPost,
      instagramFollowers: creator.instagramFollowers,
      tiktokFollowers: creator.tiktokFollowers,
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);
  }
    async getCreators(query: any) {
      const qb = this.repo
        .createQueryBuilder("creator")
        .leftJoinAndSelect("creator.user", "user");

      if (query.location) {
        qb.andWhere("creator.location = :location", {
          location: query.location,
        });
      }

      if (query.maxPrice) {
        qb.andWhere("creator.pricePerPost <= :price", {
          price: query.maxPrice,
        });
      }

      const creators = await qb.getMany();

      return creators.map(c => ({
    profileId: c.id,
    userId: c.user.id,

    // ⭐ identity
    displayName:
      c.instagram ||
      c.tiktok ||
      "Creator",

    instagram: c.instagram,
    tiktok: c.tiktok,

    bio: c.bio,
    niches: c.niches,

    location: c.location,
    pricePerPost: c.pricePerPost,

    instagramFollowers: c.instagramFollowers,
    tiktokFollowers: c.tiktokFollowers,

    instagramEngagementRate: c.instagramEngagementRate,
    tiktokEngagementRate: c.tiktokEngagementRate,

    profileImageUrl: c.profileImageUrl,
  }));
    }}