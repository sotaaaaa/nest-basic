import mongoose, { AnyObject, ClientSession } from 'mongoose';

/**
 * Thực thi một hàm trong một giao dịch MongoDB.
 * @param func Hàm sẽ được thực thi trong giao dịch.
 * @param session Phiên làm việc của client MongoDB (tùy chọn).
 * @returns Kết quả của việc thực thi hàm.
 */
export const withTransaction = async <T>(
  func: (session: ClientSession) => Promise<T>,
  session?: ClientSession,
): Promise<T> => {
  // Nếu có phiên làm việc được cung cấp, thực thi hàm trong phiên và trả về kết quả.
  if (session) return await func(session);

  // Ngược lại, bắt đầu một phiên làm việc mới.
  session = await mongoose.connections[1].startSession();

  const transactionOptions = {
    readPreference: { mode: 'primary' },
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' },
  } as AnyObject;

  try {
    let res;
    // Thực thi hàm trong giao dịch.
    await session.withTransaction(async () => {
      res = await func(session as ClientSession);
    }, transactionOptions);

    // Xác nhận giao dịch.
    await session.commitTransaction();
    return res;
  } catch (error) {
    throw error;
  } finally {
    // Kết thúc phiên làm việc.
    await session.endSession();
  }
};
