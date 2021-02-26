import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = fs.readFileSync(path).toString("utf8");

    const templateMailParse = handlebars.compile(templateFileContent);
    const html = templateMailParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreplay@nps.com>"
    });

    console.log('message -> ', message.messageId);
    console.log('message URL -> ', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();