import { Injectable } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  async uploadAvatar(file: Express.Multer.File, userId: string) {
    const fileName = `avatars/${userId}-${Date.now()}`;

    const { error } = await this.supabase.storage
      .from("profile-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw new Error(error.message);

    const { data } = this.supabase.storage
      .from("profile-images") //bucket name
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}