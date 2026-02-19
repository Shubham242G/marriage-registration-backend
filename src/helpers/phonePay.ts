import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import crypto from "crypto";

interface PhonePePaymentOptions {
    orderId: string;
    amount: number;
    mobile: string;
}

export const createPhonePaymentOrder = async (
    options: PhonePePaymentOptions
): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
        if (!options.orderId || !options.amount || !options.mobile) {
            return { success: false, message: "Missing required payment details" };
        }

        // Convert amount to paisa
        const amountInPaisa = options.amount;

        let obj = {
            merchantId: process.env.PHONEPE_MERCHANT_ID as string,
            merchantUserId: "MUID123",
            merchantTransactionId: `MT${Date.now()}`,
            amount: amountInPaisa,
            redirectUrl: `${process.env.APP_URL}/success/${options.orderId}`,
            callbackUrl: `${process.env.APP_URL}/success/${options.orderId}`,
            redirectMode: "REDIRECT",
            mobileNumber: options.mobile,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        console.log(obj, "obj");
        let objJsonStr = JSON.stringify(obj);
        let objJsonB64 = Buffer.from(objJsonStr).toString("base64");

        let hashStr = objJsonB64 + "/pg/v1/pay" + process.env.PHONEPE_SALT;
        let hash = crypto.createHash("sha256").update(hashStr).digest("hex");

        const phonepeRHeader = {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": hash + `###1`,
            },
        };

        console.log(phonepeRHeader, "phonepeRHeader");
        let config = {
            method: "POST",
            url: process.env.PHONEPE_PROD_URL + '/pg/v1/pay',
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": hash + `###1`,
            },
            data: JSON.stringify({ "request": objJsonB64 }),
        };

        console.log(config, "config");
        const orderObj = await axios.request(config);
        return { success: true, data: orderObj?.data?.data };
    } catch (error: any) {
        console.error("PhonePe Payment Error:", error?.response?.data);
        return { success: false, data: error?.response?.data };
    }
};

// Check Payment Status
interface CheckPaymentOptions {
    merchantId: string;
    merchantTransactionId: string;
}

export const checkStatusPhonePaymentOrder = async (
    options: CheckPaymentOptions
): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
        if (!options.merchantId || !options.merchantTransactionId) {
            return { success: false, message: "Missing merchantId or transactionId" };
        }

        let hashStr =
            `/pg/v1/status/${options.merchantId}/${options.merchantTransactionId}` +
            process.env.PHONEPE_SALT;
        let hash = crypto.createHash("sha256").update(hashStr).digest("hex");

        const phonepeRHeader = {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": `${hash}###${process.env.PHONEPE_SALT_INDEX}`,
                "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID as string,
            },
        };

        let config = {
            method: "get",
            url: `${process.env.PHONEPE_PROD_URL}/pg/v1/status/${options.merchantId}/${options.merchantTransactionId}`,
            headers: phonepeRHeader.headers,
        };

        const orderObj = await axios.request(config);
        if (orderObj?.data?.code === "PAYMENT_SUCCESS") {
            return {
                success: true,
                data: orderObj?.data?.data,
                message: "Your payment is successful",
            };
        } else {
            return {
                success: false,
                data: {},
                message: "Please contact admin for payment failure",
            };
        }
    } catch (error: any) {
        console.error("PhonePe Status Check Error:", error?.response?.data);
        return { success: false, data: error?.response?.data };
    }
};
