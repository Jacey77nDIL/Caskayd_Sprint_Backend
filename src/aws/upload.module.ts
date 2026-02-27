import { Module } from "@nestjs/common";
import { R2Service } from "./s3.service";

@Module({
  providers: [R2Service],
  imports: [UploadModule],
  exports: [R2Service],
})
export class UploadModule {}