import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { R2Service } from "./s3.service";

@Controller("upload")
export class UploadController {
  constructor(private r2Service: R2Service) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.r2Service.uploadFile(file);
    return { url };
  }
}