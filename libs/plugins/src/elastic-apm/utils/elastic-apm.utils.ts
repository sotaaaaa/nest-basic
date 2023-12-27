import * as APM from 'elastic-apm-node';

let instance: APM.Agent | undefined;

/**
 * Khởi tạo APM Agent với cấu hình tùy chọn (nếu có).
 * Nếu không có cấu hình, sẽ sử dụng cấu hình mặc định.
 * @param config Cấu hình APM Agent
 */
export const initializeAPMAgent = (config?: APM.AgentConfigOptions): void => {
  instance = config ? APM.start(config) : APM.start();
};

/**
 * Trả về instance của APM Agent.
 * Nếu instance chưa được khởi tạo, sẽ throw một lỗi.
 * @returns Instance của APM Agent
 * @throws Lỗi nếu APM Agent chưa được khởi tạo
 */
export const getInstance = (): APM.Agent => {
  if (!instance) {
    throw new Error('APM Agent is not initialized (run initializeAPMAgent)');
  }

  return instance;
};
