import { Controller, Get, Req, Patch, Param, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("notifications")
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getMyNotifications(@Req() req) {
    return this.service.getUserNotifications(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id/read")
  markRead(@Param("id") id: string) {
    console.log('READ NOTIFICATION:', id);
    return this.service.markAsRead(id);
  }
}