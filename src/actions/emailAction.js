"use server";

import nodemailer from "nodemailer";
import * as handlebars from "handlebars";

export const sendEmail = async ({ subject, message, email, data }) => {
  const transposer = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: 3000,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    html: message,
  };

  await new Promise((resolve, reject) => {
    transposer.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("Email Sent:", info.response);
        resolve(info.response);
      }
    });
  });
};
