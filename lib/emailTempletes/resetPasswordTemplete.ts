export const resetPasswordHtml = (url: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%); padding: 32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #fed7aa; box-shadow: 0 18px 45px rgba(194, 65, 12, 0.12);">
            <tr>
              <td style="padding: 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #ea580c 0%, #f97316 58%, #fb923c 100%);">
                  <tr>
                    <td style="padding: 28px 24px 24px; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 12px; line-height: 18px; letter-spacing: 0.18em; text-transform: uppercase; color: #ffedd5;">CraveDash Security</p>
                      <h1 style="margin: 0; font-size: 28px; line-height: 34px; color: #ffffff;">Reset your password</h1>
                      <p style="margin: 12px 0 0; font-size: 14px; line-height: 22px; color: #ffedd5;">Secure access to your account with a fresh password.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fff7ed; border: 1px solid #fdba74; border-radius: 18px;">
                  <tr>
                    <td style="padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 22px; color: #9a3412; font-weight: 600;">This reset link stays active for 15 minutes.</p>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 12px; font-size: 15px; line-height: 24px; color: #1e293b;">Hi,</p>
                <p style="margin: 0 0 22px; font-size: 15px; line-height: 24px; color: #475569;">
                  We received a request to reset your password. Click the button below to set a new password.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                  <tr>
                    <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); box-shadow: 0 10px 24px rgba(234, 88, 12, 0.24);">
                      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.02em;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 14px; line-height: 22px; color: #475569;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>
                <p style="margin: 0 0 10px; font-size: 14px; line-height: 22px; color: #475569;">
                  If the button does not work, copy and paste this URL into your browser:
                </p>
                <p style="margin: 0 0 24px; padding: 14px 16px; font-size: 13px; line-height: 21px; word-break: break-all; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px;">
                  <a href="${url}" target="_blank" style="color: #c2410c; text-decoration: underline;">${url}</a>
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 21px; color: #64748b;">
                  For security reasons, this link can only be used once and expires automatically.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 24px; background-color: #fff7ed; border-top: 1px solid #fed7aa; text-align: center;">
                <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9a3412;">© ${new Date().getFullYear()} CraveDash. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
};