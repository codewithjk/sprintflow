export interface IOtpService {
  generateAndStoreOtp(email: string): Promise<string>;
  checkRestrictions(email: string): Promise<void>;
  trackRequest(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
}