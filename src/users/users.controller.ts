import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateProfileDto } from "../auth/dto/update-profile.dto";
import { CreatorService } from "../creator/creator.service";
import { BusinessService } from "../business/business.service";
import { SupabaseService } from "../supabase/supabase.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private creatorService: CreatorService,
    private businessService: BusinessService,
    private supabaseService: SupabaseService,
  ) {}

  // Change password
  @UseGuards(JwtAuthGuard)
  @Patch("password")
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.usersService.findById(req.user.sub, true);

    const valid = await bcrypt.compare(body.currentPassword, user.password);

    if (!valid) throw new UnauthorizedException("Wrong password");

    const hashed = await bcrypt.hash(body.newPassword, 10);

    await this.usersService.updatePassword(user.id, hashed);

    return { message: "Password updated successfully" };
  }

  // Update profile (creator or business)
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

  // Upload avatar
  @UseGuards(JwtAuthGuard)
  @Patch("me/avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),

      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },

      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              "Only JPG, PNG, and WEBP files allowed",
            ),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const url = await this.supabaseService.uploadAvatar(
      file,
      req.user.sub,
    );

    return this.usersService.updateAvatar(req.user.sub, url);
  }


@UseGuards(JwtAuthGuard)
@Get("profile")
async getProfile(@Req() req) {
  return this.usersService.getMarketplaceProfile(req.user.sub);
}
}