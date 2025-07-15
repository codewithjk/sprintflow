
import crypto from 'crypto';
import redis from './client';
import { IOtpService } from '../../application/interfaces/otp-service.interface';
import { ValidationError } from '../../shared/errors/app-error';


export class OtpService implements IOtpService {
  async generateAndStoreOtp(email: string): Promise<string> {
    const otp = crypto.randomInt(1000, 9999).toString();

    await redis.set(`otp:${email}`, otp, 'EX', 300); // 5 minutes
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // 1 minute cooldown

    return otp;
  }
  async checkRestrictions(email: string): Promise<void> {
    if (await redis.get(`ort_lock:${email}`)) {
      throw new ValidationError("You have reached the maximum number of OTP requests. Please try again after 30 minutes.");
    }
    if (await redis.get(`otp_spam_lock:${email}`)) {
      throw new ValidationError("Too many OTP requests. Please wait 1 hour before trying again.");
    }
    if (await redis.get(`otp_cooldown:${email}`)) {
      throw new ValidationError("Please wait 1 minute before requesting a new OTP.");
    }
  }

  async trackRequest(email: string): Promise<void> {
    const key = `otp_request_count:${email}`;
    const count = parseInt((await redis.get(key)) || '0');

    if (count >= 2) {
      await redis.set(`otp_spam_lock:${email}`, 'true', 'EX', 3600);
      throw new ValidationError("Too many OTP requests. Please wait 1 hour before trying again.");
    }

    await redis.set(key, count + 1, 'EX', 3600);
  }

  async verifyOtp(email: string, otp: string) {
    //todo : add try catch block
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
      throw new ValidationError("OTP has expired or is invalid!")
    }
    const failedAttemptsKey = `otp_failed_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");
    if (storedOtp !== otp) {
      if (failedAttempts >= 2) {
        await redis.set(`ort_lock:${email}`, 'true', 'EX', 1800); // Lock for 30 minutes
        await redis.del(`otp:${email}`, failedAttemptsKey); // Clear failed attempts after lock
        throw new ValidationError("You have reached the maximum number of OTP attempts. Please try again after 30 minutes.");
      }
      await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
      throw new ValidationError(`Invalid OTP! Please try again. ${2 - failedAttempts} attempts left`);
    }
    await redis.del(`otp:${email}`, failedAttemptsKey); // Clear OTP after successful verification
  }
}
