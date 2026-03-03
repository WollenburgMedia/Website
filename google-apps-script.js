/**
 * WOLLENBURG MEDIA — Google Apps Script for Contact Form
 * 
 * HOW TO DEPLOY / REDEPLOY:
 * 1. Go to https://script.google.com and open your project
 * 2. Replace ALL of the code with this script
 * 3. Click Deploy > Manage Deployments > Edit (pencil icon)
 * 4. Under "Version", select "New version"
 * 5. Click Deploy
 * 6. That's it — the same URL will now use this updated code
 * 
 * GOOGLE SHEET SETUP:
 * Create a Google Sheet with these column headers in Row 1:
 * A1: Timestamp | B1: Name | C1: Email | D1: Service | E1: Message
 */

// IMPORTANT: Use ONLY the spreadsheet ID, NOT the full URL
// Your sheet URL: https://docs.google.com/spreadsheets/d/1sSvMP7xyaQJoxHAN0-eEFbFNCFXpM7hl9Pa1LV2XeFs/edit
// So the ID is just: 1sSvMP7xyaQJoxHAN0-eEFbFNCFXpM7hl9Pa1LV2XeFs
const SHEET_ID = '1sSvMP7xyaQJoxHAN0-eEFbFNCFXpM7hl9Pa1LV2XeFs';
const SHEET_NAME = 'WollenburgMedia Contact Info';

function doPost(e) {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

        // The website sends FormData (not JSON), so we read from e.parameter
        const name = e.parameter.name || '';
        const email = e.parameter.email || '';
        const service = e.parameter.service || '';
        const message = e.parameter.message || '';

        // Append a new row with timestamp
        sheet.appendRow([
            new Date().toISOString(),
            name,
            email,
            service,
            message
        ]);

        // Send email notification
        const recipient = 'macoyw@wollenburgmedia.com';
        const subject = 'New Contact: ' + name + ' — ' + service;
        const body = 'New inquiry from your website:\n\n' +
            'Name: ' + name + '\n' +
            'Email: ' + email + '\n' +
            'Service: ' + service + '\n\n' +
            'Message:\n' + message + '\n\n' +
            '---\nSent from Wollenburg Media website contact form';

        MailApp.sendEmail(recipient, subject, body);

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet(e) {
    return ContentService
        .createTextOutput('Wollenburg Media Contact Form API is running.')
        .setMimeType(ContentService.MimeType.TEXT);
}
