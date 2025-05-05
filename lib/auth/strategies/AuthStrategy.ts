import { NextAuthOptions } from "next-auth";

export interface AuthStrategy {
  getProvider(): NextAuthOptions["providers"][number];
  getCallbackUrl(): string;
  getDisplayName(): string;
  getIcon(): string;
}
