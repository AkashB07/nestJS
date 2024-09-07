import { EmailTemplateBodyTypesEnum } from '../enums/email-manager.enum';
import { IEmailTemplate } from '../interfaces/email-manager.interface';

export const USER_SET_PASSWORD_TEMPLATE: IEmailTemplate = {
  subject: 'Tripex - Welcome Email',
  body: `Hi <%= fullName %>
  <p>Welcome to Tripex.<p>
  <p>Please click below to set your password.</p>
  <a target="_blank" href="<%= setPasswordLink %>"><button style="background:#4C78DC;color:white;width:300px;height:50px;padding:5px;font-size:20px;border:0px;border-radius:4px;outline:none;cursor:pointer">Click to Set New Password</button></a><br>
  <p style="color:red;"><strong>Please note that this Link is valid for 24 hours and will expire after this period.</strong></p>
  <p>If you're unable to click the link above or you encounter any issues, please copy and paste this URL into a new browsing window instead:<p>
  <p>Set Password Link : <%= setPasswordLink %></p><br>
  <p>Warm Regards,</p>
  <p>Tripex Team</p>
  `,
  body_type: EmailTemplateBodyTypesEnum.HTML,
};
