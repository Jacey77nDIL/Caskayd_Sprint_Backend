import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SupabaseService } from "../supabase/supabase.service";

@Controller("upload")
export class UploadController {
  constructor(private supabaseService: SupabaseService) {}

  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    const url = await this.supabaseService.uploadAvatar(file, req.user.id);

    return { url };
  }
}