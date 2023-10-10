import nodemailer, { TransportOptions } from "nodemailer";


const hostOptions = {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  };

const transporter = nodemailer.createTransport(
    hostOptions as TransportOptions
  );

export {transporter} ;