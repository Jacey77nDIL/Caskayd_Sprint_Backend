import { Controller } from "@nestjs/common";
import { ChatRequestService } from "./chat-request.service";
import { Post,Body, Get, Req, Patch, Param } from "@nestjs/common";
import { CreateChatRequestDto } from "./dto/create-chat-request.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("chat-requests")
export class ChatRequestController {
  constructor(private service: ChatRequestService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateChatRequestDto, @Req() req) {
    return this.service.create(dto, req.user.sub);
  }

  @Get("creator")
  getForCreator(@Req() req) {
    return this.service.findForCreator(req.user.id);
  }

  @Patch(":id/accept")
  accept(@Param("id") id: string) {
    console.log('ACCEPT REQUEST:', id);
    return this.service.accept(id);
  }

  @Patch(":id/reject")
  reject(@Param("id") id: string) {
    return this.service.reject(id);
  }
}