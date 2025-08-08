import crypto from 'crypto';
import redis from './client';
import { IInvitationService } from '../../application/interfaces/invitation-service.interface';
import { ValidationError } from '../../shared/errors/app-error';
import { InvitationData } from '../../shared/types/src';

export class InvitationService implements IInvitationService {
  private EXPIRATION = 6 * 60 * 60; // 6 hours

  private getTokenKey(token: string): string {
    return `invite:${token}`;
  }

  private getEmailKey(orgId: string, email: string): string {
    return `invite:${orgId}:${email}`;
  }

  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // Create an invitation and store by token + email
  async createInvitation(
    data: Omit<InvitationData, 'token' | 'status' | 'timestamp'>
  ): Promise<string> {
    const emailKey = this.getEmailKey(data.orgId, data.email);
    const alreadySent = await redis.exists(emailKey);

    if (alreadySent) {
      throw new ValidationError('User has already been invited to this organization.');
    }

    const token = this.generateToken();
    const invitation: InvitationData = {
      ...data,
      token,
      status: 'pending',
      timestamp: Date.now(),
    };

    // Save invitation by token
    await redis.setex(this.getTokenKey(token), this.EXPIRATION, JSON.stringify(invitation));

    // Save marker by email for checking duplicate invite
    await redis.setex(emailKey, this.EXPIRATION, 'sent');

    return token;
  }

  // Used during joining (from token link)
  async getInvitation(token: string): Promise<InvitationData | null> {
    const data = await redis.get(this.getTokenKey(token));
    return data ? JSON.parse(data) : null;
  }

  // Mark an invite as used (when user accepts)
  async markUsed(token: string): Promise<void> {
    const invitation = await this.getInvitation(token);
    if (!invitation) {
      throw new ValidationError('Invitation link is expired. Please contact the organization.');
    }

    invitation.status = 'used';

    // Overwrite with same expiration
    await redis.setex(this.getTokenKey(token), this.EXPIRATION, JSON.stringify(invitation));
  }

  // Optional: for invalidating an invite manually
  async removeInvitation(token: string): Promise<void> {
    const invitation = await this.getInvitation(token);
    if (!invitation) return;

    await redis.del(this.getTokenKey(token));
    await redis.del(this.getEmailKey(invitation.orgId, invitation.email));
  }
}

