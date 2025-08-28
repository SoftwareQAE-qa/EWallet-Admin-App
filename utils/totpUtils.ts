import { authenticator } from 'otplib';

export class TOTPUtils {
  static generateTOTP(secret: string): string {
    return authenticator.generate(secret);
  }

  static generateCurrentTOTP(secret: string): string {
    return authenticator.generate(secret);
  }
}
