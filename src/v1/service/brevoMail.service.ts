import { CONFIG } from "@common/config.common";

const axios = require("axios");

export const SendBrevoMail = async (
  subject: string,
  to: [{ name: string; email: string }],
  htmlContent: string
) => {
  try {
    let data = JSON.stringify({
      sender: {
        name: CONFIG.ADMIN_NAME || "Vivaan Compliance & Tax Services LLP",
        email: CONFIG.ADMIN_EAMIL || "Support@marriageregistrationwala.com",
      },
      to,
      subject,
      htmlContent,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "api-key": `${process.env.BREVO_API_KEY}`,
        "content-type": "application/json",
      },
      data: data,
    };

    console.log(config, "configconfigconfigconfig");

    let { data: res } = await axios(config);
    console.log(res, "ResposenFrom Brevo");
    if (res.messageId) {
      return true;
    }
  } catch (error) {
    console.log("BREVAMAIL => ", error);
    return false;
  }
};
