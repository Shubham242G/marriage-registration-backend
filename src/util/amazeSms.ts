

// import axios from "axios";

// const AMAZE_SMS_API_KEY = process.env.AMAZE_SMS_API_KEY!;
// const AMAZE_SMS_SENDER_ID = process.env.AMAZE_SMS_SENDER_ID!;
// const AMAZE_SMS_URL = "https://sms.amazesms.com/smsapi"; // Confirm from dashboard

// export const sendSMS = async (to: string, message: string): Promise<boolean> => {
//   try {
//     const params = {
//       api_key: AMAZE_SMS_API_KEY,
//       type: "text",
//       contacts: to,
//       senderid: AMAZE_SMS_SENDER_ID,
//       msg: message,
//     };

//     const res = await axios.get(AMAZE_SMS_URL, { params });

//     // Optional: log and validate response
//     console.log("AmazeSMS Response:", res.data);

//     return res.data.status === "SUCCESS"; // Confirm the exact success field from API docs
//   } catch (err) {
//     console.error("SMS send error:", err);
//     return false;
//   }
// };
