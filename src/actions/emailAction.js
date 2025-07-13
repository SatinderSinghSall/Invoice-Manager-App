"use server";

import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { invoiceTemplate } from "@/lib/emailTemplates/invoice";

function compileInvoiceTemplate(name, amount) {
  const template = handlebars.compile(invoiceTemplate);
  const htmlBody = template({ name, amount });
  return htmlBody;
}

export const sendEmail = async ({ subject, message, email, data }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const template = compileInvoiceTemplate(data.name, data.amount);

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    html: template,
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("Email Sent:", info.response);
          resolve(info.response);
        }
      });
    });

    return {
      message: "Email sent successfully!",
    };
  } catch (error) {
    return {
      error: "Email not send. Try again!",
    };
  }
};
