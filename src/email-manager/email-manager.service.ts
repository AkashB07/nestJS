import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { EmailTemplateBodyTypesEnum } from './enums/email-manager.enum';
import { ISendTemplatePayload } from './interfaces/email-manager.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailManagerService {
  constructor(private readonly mailerService: MailerService) {}

  private async sendEmail(emailData): Promise<void> {
    return this.mailerService.sendMail(emailData);
  }

  async sendTemplateEmail(sendTemplateEmailPayload: ISendTemplatePayload) {
    const template = sendTemplateEmailPayload.template;
    const subjectCompiled = _.template(template.subject);
    const bodyCompiled = _.template(template.body);

    const emailData: any = {
      to: sendTemplateEmailPayload.to_emails,
      subject: subjectCompiled(sendTemplateEmailPayload.data),
    };
    if (template.body_type === EmailTemplateBodyTypesEnum.TEXT) {
      emailData.text = bodyCompiled(sendTemplateEmailPayload.data);
    }
    if (template.body_type === EmailTemplateBodyTypesEnum.HTML) {
      emailData.html = bodyCompiled(sendTemplateEmailPayload.data);
    }
    return await this.sendEmail(emailData);
  }
}
