import { EmailTemplateBodyTypesEnum } from '../enums/email-manager.enum';
import { IEmailTemplate } from '../interfaces/email-manager.interface';

export const USER_RESET_PASSWORD_TEMPLATE: IEmailTemplate = {
  subject: 'Tripex - Reset Password',
  body: `Hi <%= fullName %>
  <p>We have received a request to reset your password.<p>
  <p>Please click below to change your password.</p>
  <a target="_blank" href="<%= setPasswordLink %>"><button style="background:#4C78DC;color:white;width:250px;height:50px;padding:5px;font-size:20px;border:0px;border-radius:4px;outline:none;cursor:pointer">Click to Reset Password</button></a><br>
  <p style="color:red;"><strong>Please note that this Link is valid for 24 hours and will expire after this period.</strong></p>
  <p>If you're unable to click the link above or you encounter any issues, please copy and paste this URL into a new browsing window instead:<p>
  <p>Reset Password Link : <%= setPasswordLink %></p><br>
  <p>Warm Regards,</p>
  <p>Tripex Team</p>
  `,
  body_type: EmailTemplateBodyTypesEnum.HTML,
};
