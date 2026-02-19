import razorpay from "razorpay";
type PaymentProps = {
    amount: number;
    currency: string;
    key_id: string;
    key_secret: string;
    receipt: number;
};
export const createPaymentOrder = async (options: PaymentProps) => {
    try {
        let instance = new razorpay({
            key_id: options.key_id,
            key_secret: options.key_secret,
        });
        let obj = {
            amount: options.amount,
            currency: options.currency,
            receipt: options.currency,
        };
        let orderObj = await instance.orders.create(obj);
        return orderObj;
    } catch (error) {
        console.error(error);
        return error;
    }
};