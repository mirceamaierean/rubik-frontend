import { AuthStrategy } from "./AuthStrategy";
import { GoogleAuthStrategy } from "./GoogleAuthStrategy";
import { FacebookAuthStrategy } from "./FacebookAuthStrategy";

export type AuthProviderType = "google" | "facebook";

export class AuthStrategyFactory {
  private static strategyMap = new Map<
    AuthProviderType,
    new () => AuthStrategy
  >([
    ["google", GoogleAuthStrategy],
    ["facebook", FacebookAuthStrategy],
  ]);

  static getStrategy(type: AuthProviderType): AuthStrategy {
    const StrategyClass = this.strategyMap.get(type);
    if (!StrategyClass) {
      throw new Error(`Authentication strategy for ${type} not found`);
    }
    return new StrategyClass();
  }

  static getAllStrategies(): AuthStrategy[] {
    return Array.from(this.strategyMap.values()).map(
      (StrategyClass) => new StrategyClass(),
    );
  }
}
