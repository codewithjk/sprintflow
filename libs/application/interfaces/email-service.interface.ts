
export interface IEmailService {
  sendEmail(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>
  ): Promise<boolean>;
}
