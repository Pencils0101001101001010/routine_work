import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTokenEmail(
  email: string,
  token: string,
  purpose: "verify" | "reset",
) {
  const base = process.env.CLIENT_URL;
  if (!base) throw new Error("APP_URL is not set");

  const path = purpose === "verify" ? "/verify-email" : "/reset-password";
  const url = new URL(path, base);
  url.searchParams.set("token", token);

  const action =
    purpose === "verify" ? "Verify your email address" : "Reset your password";
  const expires = purpose === "verify" ? "24 hours" : "30 minutes";

  const { error } = await resend.emails.send({
    from: "RoutineWorks <notifications@update.gisteraand.co.za>",
    to: email,
    subject:
      purpose === "verify"
        ? "Verify your Routine Works account"
        : "Reset your Routine Works password",
    text: `${action} using this link:\n\n${url.toString()}\n\nThis link expires in ${expires} and can be used once. If you did not request this, ignore the message.`,
  });

  if (error) {
    throw new Error(`Resend error: ${error.name} - ${error.message}`);
  }
}

// import nodemailer from "nodemailer";

// export const transport = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   requireTLS: false,
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//   connectionTimeout: 10000,
//   socketTimeout: 20000,
// });

// export async function sendTokenEmail(
//   email: string,
//   token: string,
//   purpose: "verify" | "reset",
// ) {
//   const path = purpose === "verify" ? "/verify-email" : "/reset-password";
//   const url = new URL(path, `${process.env.CLIENT_URL}/user`);
//   url.searchParams.set("token", token);
//   await transport.sendMail({
//     from: process.env.SMTP_FROM,
//     to: email,
//     subject:
//       purpose === "verify"
//         ? "Verify your Routine Works account"
//         : "Reset your Routine Works password",
//     text: `${purpose === "verify" ? "Verify your email address" : "Reset your password"} using this link:\n\n${url.toString()}\n\nThis link expires ${purpose === "verify" ? "in 24 hours" : "in 30 minutes"} and can be used once. If you did not request this, ignore the message.`,
//   });
// }
