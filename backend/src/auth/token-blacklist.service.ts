import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  // In-memory blacklist - replace with Redis in production
  private readonly blacklist: Set<string> = new Set();
  private readonly tokenExpiry: Map<string, number> = new Map();

  /**
   * Add a token to the blacklist
   * @param token - The token to blacklist
   * @param expiresAt - When the token expires (for cleanup)
   */
  add(token: string, expiresAt?: number): void {
    this.blacklist.add(token);
    if (expiresAt) {
      this.tokenExpiry.set(token, expiresAt);
    }
    // Clean up expired tokens periodically
    this.cleanup();
  }

  /**
   * Check if a token is blacklisted
   * @param token - The token to check
   * @returns true if blacklisted
   */
  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  /**
   * Remove expired tokens from the blacklist
   */
  private cleanup(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [token, expiresAt] of this.tokenExpiry.entries()) {
      if (expiresAt < now) {
        this.blacklist.delete(token);
        this.tokenExpiry.delete(token);
      }
    }
  }

  /**
   * Get the count of blacklisted tokens (for monitoring)
   */
  getCount(): number {
    return this.blacklist.size;
  }
}
