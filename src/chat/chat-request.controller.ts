import { Controller, Post, Body, Get, Req, Patch, Param, UseGuards } from "@nestjs/common";
import { ChatRequestService } from "./chat-request.service";
import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("chat-requests")
export class ChatRequestController {
  constructor(private service: ChatRequestService) {}

  // Business sends request
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateChatRequestDto, @Req() req) {
    return this.service.create(dto, req.user.sub);
  }

  // Creator views incoming requests
  @UseGuards(AuthGuard('jwt'))
  @Get("creator")
  getForCreator(@Req() req) {
    return this.service.findForCreator(req.user.sub);
  }

  // Creator accepts request
  @UseGuards(AuthGuard('jwt'))
  @Patch(":id/accept")
  accept(@Param("id") id: string) {
    return this.service.accept(id);
  }

  // Creator rejects request
  @UseGuards(AuthGuard('jwt'))
  @Patch(":id/reject")
  reject(@Param("id") id: string) {
    return this.service.reject(id);
  }
}