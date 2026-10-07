import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Cloud Function triggered when a new document is added to the 'contacts' collection.
 * This integrates with the official Firebase "Trigger Email" extension by writing 
 * a notification document to the 'mail' collection.
 */
export const sendContactEmailNotification = onDocumentCreated('contacts/{contactId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }

  const contact = snapshot.data();
  const recipientEmail = 'santoshmishras951@gmail.com'; // Your notification email

  try {
    // Writing to the 'mail' collection triggers the official Firebase "Trigger Email" extension
    await admin.firestore().collection('mail').add({
      to: recipientEmail,
      message: {
        subject: `📬 New Portfolio Inquiry: ${contact.subject || 'Contact Form Submission'}`,
        text: `You received a new message from your portfolio contact form:\n\n` +
              `• Name: ${contact.name}\n` +
              `• Email: ${contact.email}\n` +
              `• Phone: ${contact.phone || 'N/A'}\n` +
              `• Organization: ${contact.organization || 'N/A'}\n` +
              `• Subject: ${contact.subject || 'N/A'}\n\n` +
              `Message:\n${contact.message}\n\n` +
              `------------------------------------\n` +
              `Submitted At: ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2563eb; margin-top: 0;">📬 New Portfolio Contact Message</h2>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 15px 0;" />
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
            <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
            <p><strong>Organization:</strong> ${contact.organization || 'N/A'}</p>
            <p><strong>Subject:</strong> ${contact.subject || 'N/A'}</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="margin-top: 0; font-weight: bold;">Message:</p>
              <p style="white-space: pre-wrap; margin-bottom: 0;">${contact.message}</p>
            </div>
            <p style="font-size: 11px; color: #6b7280; margin-top: 20px;">Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        `
      }
    });

    console.log(`[Cloud Function] Email trigger document created successfully for contact ID: ${event.params.contactId}`);
  } catch (error) {
    console.error('[Cloud Function Error] Failed to create email trigger document:', error);
    throw error;
  }
});
