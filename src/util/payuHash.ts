// /src/utils/payuHash.util.ts

import crypto from "crypto";

// Interfaces for type safety
interface IPayURequestParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
}

interface IPayUCallbackBody {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  status: string;
  hash: string;
}

/**
 * Generates the request hash for a PayU payment.
 * The order of fields in the hash string is critical.
 * format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
 */
export const generatePayUHash = (
  params: IPayURequestParams,
  salt: string
): string => {
  const { key, txnid, amount, productinfo, firstname, email } = params;

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;

  return crypto.createHash("sha512").update(hashString).digest("hex");
};

/**
 * Verifies the response hash from the PayU callback.
 * The order of fields in the reverse hash string is critical.
 * format: SALT|status|||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
export const verifyPayUHash = (
  response: IPayUCallbackBody,
  salt: string
): boolean => {
  const { status, txnid, email, firstname, productinfo, amount, key, hash } =
    response;

  const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  console.log(salt, "check salt");
  console.log("Calculated Hash:", calculatedHash);
  console.log("Provided Hash:", hash);

  return calculatedHash === hash;
};
