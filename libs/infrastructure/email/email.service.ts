// src/infra/services/email.service.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import { IEmailService } from '../../application/interfaces/email-service.interface';


dotenv.config();

export class EmailService implements IEmailService {
  private transporter;

  constructor(private readonly templateBasePath: string) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      service: process.env.SMTP_SERVICE,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  private async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
   const templatePath = path.join(this.templateBasePath, `${templateName}.ejs`);
    return ejs.renderFile(templatePath, data);
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>
  ): Promise<boolean> {
    try {
      const html = await this.renderTemplate(templateName, data);

      const mailOptions = {
        from: `<${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }
}
