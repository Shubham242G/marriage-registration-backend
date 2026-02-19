// utils/sendSms.ts
import twilio from 'twilio';




const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

/**
 * Send SMS via Twilio
 */
export const sendSMS = async (to: string, body: string): Promise<boolean> => {
  try {
    const message = await client.messages.create({
      body,
      from: fromPhone,
      to, // Must be in E.164 format (+91XXXXXXXXXX)
    });

    console.log('SMS sent:', message.sid);
    return true;
  } catch (err) {
    console.error('Twilio SMS Error:', err);
    return false;
  }
};
