import {
  Controller,
  Patch,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateProfileDto } from "../auth/dto/update-profile.dto";
import { CreatorService } from "../creator/creator.service";
import { BusinessProfile } from "../business/business.entity";
import { BusinessService } from "../business/business.service";
import { S3Service } from "../aws/s3.service";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller("users")
export class UsersController {
  constructor(
  private usersService: UsersService,
  private creatorService: CreatorService,
  private businessService: BusinessService,
  private s3Service: S3Service,
) {}

  @UseGuards(JwtAuthGuard)
  @Patch("password")
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const user = await this.usersService.findById(req.user.sub);

    const valid = await bcrypt.compare(
      body.currentPassword,
      user.password
    );

    if (!valid) throw new UnauthorizedException("Wrong password");

    const hashed = await bcrypt.hash(body.newPassword, 10);

    await this.usersService.updatePassword(user.id, hashed);

    return { message: "Password updated successfully" };
  }

  @UseGuards(JwtAuthGuard)
    @Patch("profile")
    async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    const userId = req.user.sub;
    const role = req.user.role;

    if (role === "creator") {
        await this.creatorService.updateProfile(userId, dto);
        return { message: "Creator profile updated" };
    }

    if (role === "business") {
        await this.businessService.updateProfile(userId, dto);
        return { message: "Business profile updated" };
    }

    return { message: "Nothing updated" };
    }

  @Patch("me/avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const url = await this.s3Service.uploadFile(file);

    return this.usersService.updateAvatar(req.user.sub, url);
  }
}