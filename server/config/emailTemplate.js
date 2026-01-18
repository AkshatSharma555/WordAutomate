export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verification</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: 'Outfit', 'Helvetica', sans-serif; background-color: #f3f2ed; }
    table { border-collapse: collapse; }
    .container { width: 100%; max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #050505; padding: 30px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .accent { color: #F54A00; }
    .content { padding: 40px 30px; color: #333333; text-align: center; }
    .title { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 16px; }
    .text { font-size: 15px; line-height: 1.6; color: #555; margin-bottom: 24px; }
    .email-highlight { color: #1AA3A3; font-weight: 600; }
    .otp-box { background: #F3F2ED; border: 1px dashed #1AA3A3; padding: 15px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #1AA3A3; margin: 20px 0; display: inline-block; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
    @media only screen and (max-width: 480px) {
      .container { width: 90% !important; margin: 20px auto; }
      .otp-box { font-size: 24px; letter-spacing: 2px; }
    }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F3F2ED">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <div class="container">
            <div class="header">
              <div class="logo-text">Word<span class="accent">Automate</span></div>
            </div>
            
            <div class="content">
              <div class="title">Verify Your Admin Account 🛡️</div>
              <div class="text">
                Hey Master! You are just one step away from accessing the Admin Panel. 
                Please verify your email: <span class="email-highlight">{{email}}</span>
              </div>
              
              <div style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</div>
              
              <div class="otp-box">{{otp}}</div>
              
              <div class="text" style="font-size: 13px; margin-top: 10px;">
                This OTP is valid for <strong>24 hours</strong>. <br>Do not share this with anyone.
              </div>
            </div>

            <div class="footer">
              &copy; WordAutomate Admin System.<br>
              Secure Automated Documentation.
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body { margin: 0; padding: 0; font-family: 'Outfit', 'Helvetica', sans-serif; background-color: #f3f2ed; }
    table { border-collapse: collapse; }
    .container { width: 100%; max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #050505; padding: 30px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .accent { color: #1AA3A3; } /* Teal Accent for Reset */
    .content { padding: 40px 30px; color: #333333; text-align: center; }
    .title { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 16px; }
    .text { font-size: 15px; line-height: 1.6; color: #555; margin-bottom: 24px; }
    .email-highlight { color: #F54A00; font-weight: 600; }
    .otp-box { background: #fff0eb; border: 1px dashed #F54A00; padding: 15px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #F54A00; margin: 20px 0; display: inline-block; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
    @media only screen and (max-width: 480px) {
      .container { width: 90% !important; margin: 20px auto; }
      .otp-box { font-size: 24px; letter-spacing: 2px; }
    }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F3F2ED">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <div class="container">
            <div class="header">
              <div class="logo-text">Word<span class="accent">Automate</span></div>
            </div>
            
            <div class="content">
              <div class="title">Reset Your Password 🔒</div>
              <div class="text">
                We received a request to reset the password for your Admin account: <span class="email-highlight">{{email}}</span>
              </div>
              
              <div style="font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 1px;">Use this OTP to Reset</div>
              
              <div class="otp-box">{{otp}}</div>
              
              <div class="text" style="font-size: 13px; margin-top: 10px;">
                This OTP is valid for <strong>15 minutes</strong> only. <br>If you didn't request this, please ignore this email.
              </div>
            </div>

            <div class="footer">
              &copy; WordAutomate Admin System.<br>
              Secure Automated Documentation.
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;