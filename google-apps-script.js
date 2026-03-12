// ============================================================
// WOLLENBURG MEDIA — Google Apps Script
// Contact Form → Google Sheets + Email Notification
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com and create a new project
// 2. Delete the default code and paste this entire script
// 3. Click Deploy → New deployment
// 4. Select "Web app" as the type
// 5. Set "Execute as" to your Google account
// 6. Set "Who has access" to "Anyone"
// 7. Click Deploy and authorize when prompted
// 8. Copy the Web App URL and paste it into:
//    - script.js (line ~706, GOOGLE_SCRIPT_URL variable)
//    - shared.js (line ~287, GOOGLE_SCRIPT_URL variable)
// 9. Create a Google Sheet and copy the Sheet ID from the URL
//    (the long string between /d/ and /edit in the URL)
// 10. Paste the Sheet ID below in SHEET_ID
//
// SHEET FORMAT (create these headers in Row 1):
// A: Timestamp | B: Name | C: Email | D: Phone | E: Service | F: Message
// ============================================================

// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES
const SHEET_ID = '1sSvMP7xyaQJoxHAN0-eEFbFNCFXpM7hl9Pa1LV2XeFs';
const NOTIFY_EMAIL = 'macoy@wollenburgmedia.com';
const SHEET_NAME = 'WollenburgMediaContactInfo'; // or whatever your sheet tab is named

function doPost(e) {
  try {
    // Parse form data
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    const service = e.parameter.service || '';
    const message = e.parameter.message || '';
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

    // 1. Log to Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([timestamp, name, email, phone, service, message]);

    // 2. Send email notification
    const subject = `🔔 New Lead: ${name} — ${service}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a0a0a; padding: 24px; border-bottom: 3px solid #C41E3A;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New Contact Form Submission</h1>
          <p style="color: #C41E3A; margin: 4px 0 0; font-size: 14px;">Wollenburg Media Website</p>
        </div>
        <div style="background: #161616; padding: 24px; color: #d4d4d4;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #C41E3A; font-weight: bold; width: 100px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #ffffff;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #C41E3A; font-weight: bold;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #333;"><a href="mailto:${email}" style="color: #ffffff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #C41E3A; font-weight: bold;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #ffffff;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #C41E3A; font-weight: bold;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #333; color: #ffffff;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #C41E3A; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #ffffff; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
        <div style="background: #0a0a0a; padding: 16px 24px; text-align: center;">
          <p style="color: #666; font-size: 12px; margin: 0;">Submitted at ${timestamp} (CST)</p>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: email
    });

    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Form submitted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput('Wollenburg Media Contact Form Script is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
