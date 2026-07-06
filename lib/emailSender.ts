import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: parseInt(config.email.port as string),
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) =>{

  const info = await transporter.sendMail({
    from: `"FixItNow" <${config.email.user}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent:", info.messageId);
}