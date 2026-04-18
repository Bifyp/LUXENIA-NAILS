import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

function getCodeEmailTemplate(code: string) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f43f5e 100%);font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f43f5e 100%);padding:48px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding-bottom:32px;">
          <div style="font-size:32px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
            LUXENIA
          </div>
          <div style="font-size:12px;font-weight:500;color:rgba(255,255,255,0.8);letter-spacing:0.1em;text-transform:uppercase;margin-top:8px;">
            Nails Studio
          </div>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.15);">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:48px 40px 32px;">
              <div style="width:64px;height:64px;background:linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
                <div style="font-size:32px;line-height:1;">💅</div>
              </div>
            </td></tr>
            <tr><td align="center" style="padding:0 40px 24px;">
              <div style="font-size:28px;font-weight:700;color:#1f2937;line-height:1.2;margin-bottom:8px;">Potwierdzenie</div>
              <div style="font-size:28px;font-weight:700;background:linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.2;">adresu e-mail</div>
            </td></tr>
            <tr><td align="center" style="padding:0 40px 32px;">
              <p style="font-size:15px;font-weight:400;color:#6b7280;line-height:1.6;margin:0;text-align:center;">
                Dziękujemy za rejestrację.<br/>Wprowadź poniższy kod, aby dokończyć tworzenie konta.
              </p>
            </td></tr>
            <tr><td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);border-radius:16px;border:2px solid #fecdd3;">
                <tr><td align="center" style="padding:20px 24px 8px;">
                  <div style="font-size:11px;font-weight:600;color:#f43f5e;letter-spacing:0.15em;text-transform:uppercase;">Twój kod</div>
                </td></tr>
                <tr><td align="center" style="padding:8px 24px 20px;">
                  <div style="font-size:48px;font-weight:700;color:#1f2937;letter-spacing:0.15em;line-height:1;">${code}</div>
                </td></tr>
                <tr><td align="center" style="padding:0 24px 20px;">
                  <div style="font-size:12px;font-weight:500;color:#9ca3af;">Ważny przez <span style="color:#f43f5e;font-weight:600;">10 minut</span></div>
                </td></tr>
              </table>
            </td></tr>
            <tr><td align="center" style="padding:0 40px 48px;">
              <p style="font-size:12px;font-weight:400;color:#9ca3af;margin:0;line-height:1.5;">
                Jeśli nie tworzyłeś konta — po prostu zignoruj tę wiadomość.
              </p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding-top:32px;">
          <div style="font-size:12px;font-weight:500;color:rgba(255,255,255,0.9);letter-spacing:0.05em;">LUXENIA Nails Studio</div>
          <div style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.7);margin-top:4px;">Swarzędz, Poland</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEmailCode(email: string, code: string) {
  const transporter = getTransporter();
  
  // Проверяем соединение перед отправкой
  await transporter.verify();
  console.log("📡 SMTP соединение OK");
  
  await transporter.sendMail({
    from: `"Beauty Studio" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Ваш код подтверждения",
    html: getCodeEmailTemplate(code)
  });
}
