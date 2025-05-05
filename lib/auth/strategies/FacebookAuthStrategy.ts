import FacebookProvider from "next-auth/providers/facebook";
import { AuthStrategy } from "./AuthStrategy";
import { env } from "@/env.mjs";

export class FacebookAuthStrategy implements AuthStrategy {
  getProvider() {
    return FacebookProvider({
      clientId: env.FACEBOOK_ID as string,
      clientSecret: env.FACEBOOK_SECRET as string,
    });
  }

  getCallbackUrl() {
    return "/";
  }

  getDisplayName() {
    return "Continue with Facebook";
  }

  getIcon() {
    return "facebook-icon.svg";
  }
}
