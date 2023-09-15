import { UserDocument } from "src/users/schemas/user.schema";

export interface AuthResponse {
    access_token: string;
    user: UserDocument;
  }