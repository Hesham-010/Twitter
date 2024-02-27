import * as nodemailer from 'nodemailer';
export function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const option = {
    from: 'Twitter',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  transporter.sendMail(option);
}
