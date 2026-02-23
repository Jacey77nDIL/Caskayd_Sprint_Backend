import { Notification } from "./notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  async create(recipientId: string, type: string, message: string, relatedId?: string) {
    return this.repo.save({
      recipient: { id: recipientId },
      type,
      message,
      relatedId,
    });
  }

  async getUserNotifications(userId: string) {
    return this.repo.find({
      where: { recipient: { id: userId } },
      order: { createdAt: "DESC" },
    });
  }

  async markAsRead(id: string) {
    return this.repo.update(id, { isRead: true });
  }
}