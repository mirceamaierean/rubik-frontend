"use client";

import { signIn } from "next-auth/react";
import { AuthStrategyFactory } from "@/lib/auth/strategies/AuthStrategyFactory";
import Image from "next/image";

export default function LoginPage() {
  const handleLogin = (provider: "google" | "facebook") => {
    const strategy = AuthStrategyFactory.getStrategy(provider);
    signIn(provider, { callbackUrl: strategy.getCallbackUrl() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Please sign in to continue
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin("google")}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cube-blue dark:focus:ring-offset-gray-800 transition-colors"
          >
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </button>
          <button
            onClick={() => handleLogin("facebook")}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cube-blue dark:focus:ring-offset-gray-800 transition-colors"
          >
            <Image
              src="/facebook-icon.svg"
              alt="Facebook"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
