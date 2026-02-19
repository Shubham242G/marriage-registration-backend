import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export const generateRandomNum = () => {
    return uuidv4();
};

export const generatePPCNumber = (prefix: string, sequenceNumber: number) => {
    // Get current financial year

    let today = new Date();


    if (today.getMonth() - 1 < 2) {
        today.setFullYear(today.getFullYear() - 1)
    }


    const currentYear = moment(today).format('YY');





    const nextYear = moment().add(1, 'year').format('YY');

    const financialYear = `${currentYear}-${nextYear}`;




    // Generate sequence number with leading zeros
    const sequence = sequenceNumber.toString().padStart(4, '0');
    // Increment sequence number for next call
    // sequenceNumber++;

    // Construct the final string
    const result = `${prefix}${sequence}/${financialYear}`;
    return result;
}
export const checkDateHourDifference = (date: Date | string): number => {
    const now = moment();
    const tokenSentAt = moment(date);
    const difference = moment.duration(now.diff(tokenSentAt));
    const hoursDiff = difference.asHours();
    return hoursDiff;
};