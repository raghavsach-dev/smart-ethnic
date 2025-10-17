import Airtable from 'airtable';

const base = new Airtable({
  apiKey: 'pat18rQd0Bk22cF0r.4f6500c6b880e3b0450645604508de7b1e99e106889b96ee3736a53eaf6f31f2',
}).base('appXvKEFCi79HaYmA');

const TABLE_NAME = 'OTPs';

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in Airtable
export async function storeOTP(email: string, otp: string): Promise<void> {
  try {
    await base(TABLE_NAME).create({
      Email: email,
      OTP: otp,
    });
  } catch (error) {
    console.error('Error storing OTP in Airtable:', error);
    throw new Error('Failed to store OTP. Please try again.');
  }
}

// Validate OTP from Airtable (currently not used - validating from component state instead)
// export async function validateOTP(email: string, otp: string): Promise<boolean> {
//   try {
//     const records = await base(TABLE_NAME)
//       .select({
//         filterByFormula: `{Email} = '${email}'`,
//         sort: [{ field: 'Created Time', direction: 'desc' }],
//         maxRecords: 1,
//       })
//       .firstPage();

//     if (records.length === 0) {
//       return false;
//     }

//     const record = records[0];
//     const storedOTP = record.get('OTP') as string;

//     return storedOTP === otp;
//   } catch (error) {
//     console.error('Error validating OTP from Airtable:', error);
//     throw new Error('Failed to validate OTP. Please try again.');
//   }
// }

// Clean up old OTPs (optional utility function)
export async function cleanupOldOTPs(hoursOld: number = 24): Promise<void> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `DATETIME_DIFF(NOW(), {Created Time}, 'hours') > ${hoursOld}`,
      })
      .firstPage();

    const recordIds = records.map(record => record.id);

    if (recordIds.length > 0) {
      await base(TABLE_NAME).destroy(recordIds);
      console.log(`Cleaned up ${recordIds.length} old OTP records`);
    }
  } catch (error) {
    console.error('Error cleaning up old OTPs:', error);
  }
}
