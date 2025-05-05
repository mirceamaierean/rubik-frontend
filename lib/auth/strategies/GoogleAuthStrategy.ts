import GoogleProvider from "next-auth/providers/google";
import { AuthStrategy } from "./AuthStrategy";
import { env } from "@/env.mjs";

export class GoogleAuthStrategy implements AuthStrategy {
  getProvider() {
    return GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    });
  }

  getCallbackUrl() {
    return "/";
  }

  getDisplayName() {
    return "Continue with Google";
  }

  getIcon() {
    return "google-icon.svg";
  }
}
