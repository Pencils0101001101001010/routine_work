import { transporter } from "../config/transporter.js";
export async function sendMatchNotification(email, match) {
    const titleIfNull = match.title || "an available vacancy";
    const companyIfNull = match.company || "This company";
    try {
        const res = await transporter.sendMail({
            from: '"RoutineWorks" <kinpencils@gmail.com>',
            to: email,
            subject: `New match: ${titleIfNull} at ${companyIfNull}`,
            text: `A new job matching your preferences was posted: ${titleIfNull} at ${companyIfNull}. Apply here: ${match.sourceUrl}`,
            html: `
       <div
      style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 480px;
        margin: 0 auto;
        padding: 32px 24px;
        color: #1a1a1a;
        background-color: #ffffff;
      "
    >
      <p
        style="
          font-size: 13px;
          color: #2563eb;
          font-weight: bold;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin: 0 0 12px;
        "
      >
        New job match
      </p>

      <h1
        style="
          font-size: 21px;
          line-height: 1.4;
          margin: 0 0 16px;
          color: #111111;
        "
      >
        ${companyIfNull} now hiring ${titleIfNull}
      </h1>

      <p
        style="
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 28px;
          color: #3a3a3a;
        "
      >
        This listing matches a preference you saved. Applications go through the
        original job posting.
      </p>

      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        style="margin: 0 0 32px"
      >
        <tr>
          <td style="background-color: #2563eb; border-radius: 6px">
            <a
              href="${match.sourceUrl}"
              style="
                display: inline-block;
                color: #ffffff;
                text-decoration: none;
                font-size: 15px;
                font-weight: bold;
                padding: 12px 28px;
              "
            >
              View and apply
            </a>
          </td>
        </tr>
      </table>

      <hr
        style="border: none; border-top: 1px solid #e5e5e5; margin: 0 0 20px"
      />

      <p style="font-size: 12px; color: #8a8a8a; line-height: 1.5; margin: 0">
        Jobs by
        <a href="http://www.adzuna.co.uk"
          >
        <img
            src="https://zunastatic-abf.kxcdn.com/assets/images/press/adzuna_logo/adzuna_logo.jpg"
            alt="Adzuna logo"
            width="50px"
            height="20px"
        />
        </a>
        &nbsp;&middot;&nbsp; You're receiving this because you saved a job
        preference on RoutineWork.
      </p>
    </div>
    `,
        });
        // console.log("Message sent: %s", res.messageId);
        if (res.rejected.length > 0) {
            console.error(`Email to ${email} was rejected:`, res.rejectedErrors ?? res.rejected);
            return {
                success: false,
                reason: "rejected",
                details: res.rejectedErrors,
            };
        }
        if (res.accepted.length > 0) {
            // console.log("Message sent: %s", res.messageId);
            return { success: true, providerId: res.messageId };
        }
        //  neither accepted nor rejected populated
        console.warn("Unexpected sendMail response:", res);
        return { success: false, reason: "unknown" };
    }
    catch (err) {
        console.error(`Failed to send email to ${email}:`, err);
        return { success: false, reason: "exception", error: err };
    }
}
//# sourceMappingURL=emailServices.js.map