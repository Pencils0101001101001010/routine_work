import { Resend } from "resend";
import type { JobMatch } from "../types/index.js";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log(`-----${process.env.RESEND_API_KEY}-------------`);

export async function sendMatchNotification(
  email: string,
  match: JobMatch,
): Promise<{
  success: boolean;
  reason?: string;
  error?: unknown;
  providerId?: string;
}> {
  const titleIfNull = match.title || "an available vacancy";
  const companyIfNull = match.company || "This company is";

  try {
    const { data, error } = await resend.emails.send({
      //once verified use : RoutineWorks <update.gisteraand.co.za>
      from: "RoutineWorks <notifications@update.gisteraand.co.za>",
      to: email,
      subject: `New match: ${titleIfNull} at ${companyIfNull}`,
      text: `A new job matching your preferences was posted: ${titleIfNull} at ${companyIfNull}. Apply here: ${match.sourceUrl}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; background-color: #ffffff;">
          <p style="font-size: 13px; color: #2563eb; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px;">
            New job match
          </p>
          <h1 style="font-size: 21px; line-height: 1.4; margin: 0 0 16px; color: #111111;">
            ${companyIfNull} now hiring a ${titleIfNull}
          </h1>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 28px; color: #3a3a3a;">
            This listing matches a preference you saved. Applications go through the original job posting.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 32px">
            <tr>
              <td style="background-color: #2563eb; border-radius: 6px">
                <a href="${match.sourceUrl}" style="display: inline-block; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold; padding: 12px 28px;">
                  View and apply
                </a>
              </td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0 0 20px" />
          <p style="font-size: 12px; color: #8a8a8a; line-height: 1.5; margin: 0">
            Jobs by
            <a href="http://www.adzuna.co.za">
              <img src="https://zunastatic-abf.kxcdn.com/assets/images/press/adzuna_logo/adzuna_logo.jpg" alt="Adzuna logo" width="50" height="20" />
            </a>
            &nbsp;&middot;&nbsp; You're receiving this because you saved a job preference on RoutineWork.
            To unsubscribe, log in to your profile to delete preferences.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`Failed to send email to ${email}:`, error);
      return { success: false, reason: "exception", error };
    }

    return { success: true, providerId: data?.id };
  } catch (err) {
    console.error(`Unexpected error sending to ${email}:`, err);
    return { success: false, reason: "exception", error: err };
  }
}

// import { transporter } from "../config/transporter.js";
// import type { JobMatch } from "../types/index.js";

// export async function sendMatchNotification(
//   email: string,
//   match: JobMatch,
// ): Promise<{
//   success: boolean;
//   reason?: string;
//   error?: unknown;
//   details?: unknown;
//   providerId?: string;
// }> {
//   const titleIfNull = match.title || "an available vacancy";
//   const companyIfNull = match.company || "This company is";

//   try {
//     const res = await transporter.sendMail({
//       from: '"RoutineWorks" <kinpencils@gmail.com>',
//       to: email,
//       subject: `New match: ${titleIfNull} at ${companyIfNull}`,
//       text: `A new job matching your preferences was posted: ${titleIfNull} at ${companyIfNull}. Apply here: ${match.sourceUrl}`,
//       html: `
//        <div
//       style="
//         font-family: Arial, Helvetica, sans-serif;
//         max-width: 480px;
//         margin: 0 auto;
//         padding: 32px 24px;
//         color: #1a1a1a;
//         background-color: #ffffff;
//       "
//     >
//       <p
//         style="
//           font-size: 13px;
//           color: #2563eb;
//           font-weight: bold;
//           letter-spacing: 0.5px;
//           text-transform: uppercase;
//           margin: 0 0 12px;
//         "
//       >
//         New job match
//       </p>

//       <h1
//         style="
//           font-size: 21px;
//           line-height: 1.4;
//           margin: 0 0 16px;
//           color: #111111;
//         "
//       >
//         ${companyIfNull} now hiring a ${titleIfNull}
//       </h1>

//       <p
//         style="
//           font-size: 15px;
//           line-height: 1.6;
//           margin: 0 0 28px;
//           color: #3a3a3a;
//         "
//       >
//         This listing matches a preference you saved. Applications go through the
//         original job posting.
//       </p>

//       <table
//         role="presentation"
//         cellpadding="0"
//         cellspacing="0"
//         style="margin: 0 0 32px"
//       >
//         <tr>
//           <td style="background-color: #2563eb; border-radius: 6px">
//             <a
//               href="${match.sourceUrl}"
//               style="
//                 display: inline-block;
//                 color: #ffffff;
//                 text-decoration: none;
//                 font-size: 15px;
//                 font-weight: bold;
//                 padding: 12px 28px;
//               "
//             >
//               View and apply
//             </a>
//           </td>
//         </tr>
//       </table>

//       <hr
//         style="border: none; border-top: 1px solid #e5e5e5; margin: 0 0 20px"
//       />

//       <p style="font-size: 12px; color: #8a8a8a; line-height: 1.5; margin: 0">
//         Jobs by
//         <a href="http://www.adzuna.co.uk"
//           >
//         <img
//             src="https://zunastatic-abf.kxcdn.com/assets/images/press/adzuna_logo/adzuna_logo.jpg"
//             alt="Adzuna logo"
//             width="50px"
//             height="20px"
//         />
//         </a>
//         &nbsp;&middot;&nbsp; You're receiving this because you saved a job
//         preference on RoutineWork.
//         To unsubscribe login in to you profile to delete preferences
//       </p>
//     </div>
//     `,
//     });

//     // console.log("Message sent: %s", res.messageId);

//     if (res.rejected.length > 0) {
//       console.error(
//         `Email to ${email} was rejected:`,
//         res.rejectedErrors ?? res.rejected,
//       );
//       return {
//         success: false,
//         reason: "rejected",
//         details: res.rejectedErrors,
//       };
//     }
//     if (res.accepted.length > 0) {
//       // console.log("Message sent: %s", res.messageId);
//       return { success: true, providerId: res.messageId };
//     }

//     //  neither accepted nor rejected populated
//     console.warn("Unexpected sendMail response:", res);
//     return { success: false, reason: "unknown" };
//   } catch (err) {
//     console.error(`Failed to send email to ${email}:`, err);
//     return { success: false, reason: "exception", error: err };
//   }
// }
