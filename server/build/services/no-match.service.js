import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendNoMatchNotification(email, noMatch) {
    try {
        const { data, error } = await resend.emails.send({
            from: "RoutineWorks <notifications@update.gisteraand.co.za>",
            to: email,
            subject: `No match on you preference`,
            text: `We couldn't find a match, Try setting and new preference or location for ${noMatch.job_title}`,
            html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; background-color: #ffffff;">
          <p style="font-size: 13px; color: #2563eb; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px;">
            No job matched
          </p>
          <h1 style="font-size: 21px; line-height: 1.4; margin: 0 0 16px; color: #D9361E;">
            There was no match found for "${noMatch.job_title}". Try a different title or location. 
          </h1>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 28px; color: #3a3a3a;">
            By setting a new preference and location, you will increase the chances of receiving more job listings. You can set up to five(5) preferences on your profile. 
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0 0 20px" />
          <p style="font-size: 12px; color: #8a8a8a; line-height: 1.5; margin: 0">
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
    }
    catch (err) {
        console.error(`Unexpected error sending to ${email}:`, err);
        return { success: false, reason: "exception", error: err };
    }
}
//# sourceMappingURL=no-match.service.js.map