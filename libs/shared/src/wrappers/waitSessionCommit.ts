import { ClientSession } from 'mongoose';

/**
 * Chờ đợi khi giao dịch được commit và thực thi một hàm.
 * @param func Hàm cần thực thi khi giao dịch được commit.
 * @param session Phiên giao dịch (tùy chọn).
 */
export const waitForSessionCommit = async (
  func: () => Promise<void> | void,
  session?: ClientSession,
) => {
  if (!session) {
    func();
  } else {
    session.addListener('ended', async (session: ClientSession) => {
      if (session.transaction.isCommitted) await func();
    });
  }
};
