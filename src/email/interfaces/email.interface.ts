export interface EmailProviderInterface {
  sendEmail(
    to: string,
    subject: string,
    eventName: string,
    dynamicData: Record<string, unknown>,
  ): Promise<void>;
}
