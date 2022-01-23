import logger from '../../logger'
import {injectable} from 'inversify'

export type EmailContent = {
  html: string
  text: string
}

export interface EmailNotifier {
  sendEmail(to: string, content: EmailContent): Promise<void>
}

@injectable()
export class NullEmailNotifier implements EmailNotifier {
  public async sendEmail(to: string, content: EmailContent): Promise<void> {
    logger.debug('null_send_email', {
      to,
      content,
    })
  }
}