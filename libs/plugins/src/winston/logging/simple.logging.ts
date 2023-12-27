import { ConsoleLogger, Inject, Injectable, LogLevel } from '@nestjs/common';
import { APM_INSTANCE } from '@skylinetech/plugins';
import APM from 'elastic-apm-node';
import { isLocal } from '@skylinetech/shared/utils';
import * as _ from 'lodash';

@Injectable()
export class SimpleLoggerService extends ConsoleLogger {
  public readonly env = process.env.NODE_ENV || 'development';

  constructor(@Inject(APM_INSTANCE) private readonly apm: APM.Agent) {
    super(SimpleLoggerService.name);
  }

  // Lấy context và messages
  private getContextAndMessages(args: unknown[]) {
    let context = process.env.SERVICE_NAME || this.context;
    let messages = args;

    // Nếu đối số cuối cùng là một chuỗi, nó là context
    if (args?.length > 1) {
      const lastElement = args[args.length - 1];
      if (_.isString(lastElement)) {
        context = lastElement as string;
        messages = args.slice(0, args.length - 1);
      }
    }

    // Nếu đối số đầu tiên là một chuỗi, nó là context
    return { context, messages };
  }

  // Lấy context, stack và messages
  private getContextAndStackAndMessages(args: unknown[]) {
    const { messages, context } = this.getContextAndMessages(args);
    if (!messages || messages.length <= 1) {
      return { messages, context };
    }

    // Nếu đối số cuối cùng là một chuỗi, nó là stack
    const lastElement = messages[messages.length - 1];
    const isStack = _.isString(lastElement);

    if (isStack) {
      return {
        stack: lastElement as string,
        messages: messages.slice(0, messages.length - 1),
        context,
      };
    } else {
      // Thêm else statement để tránh redundant return statement
      return { messages, context };
    }
  }

  /**
   * Hiển thị message và stack
   * @param context
   * @param messages
   * @param logLevel
   * @param writeStreamType
   */
  private printMessage(
    context: string,
    messages: any[],
    level: LogLevel = 'log',
    messageRef: string,
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    const messageLocal = messages.map((data) => this.stringifyMessage(data, level));
    const traceId = this.apm.currentTraceIds['trace.id'] || '---';
    const levelString = level.toUpperCase().padStart(7, ' ');
    const formattedMsgs = isLocal()
      ? messageLocal
      : messages.map((data) => {
          if (['number', 'boolean', 'string'].includes(typeof data)) {
            return data;
          }
          return JSON.stringify(data);
        });

    // Format context
    const formattedContext = isLocal() ? this.formatContext(context) : `[${context}]`;
    const formattedLogLevel = isLocal() ? this.colorize(levelString, level) : levelString;
    const formattedTraceId = isLocal() ? this.colorize(traceId, level) : traceId;
    const formattedDate = this.colorize(new Date().toLocaleString('fr'), level);
    const composedMessage = `${formattedDate} ${formattedLogLevel} ${formattedTraceId} ${formattedContext}`;

    // Tìm kiếm transaction và tạo các cặp thẻ span
    // Nếu có span hiện tại, kết thúc nó
    const transaction = this.apm.currentTransaction;
    const span = this.apm.currentSpan;
    span && (span.outcome = 'success') && span.end();

    // Bắt đầu một span mới với parent là transaction hiện tại
    transaction && transaction.startSpan(messageRef);

    // Ghi log
    writeStreamType == 'stderr'
      ? console.error(composedMessage, ...formattedMsgs)
      : console.log(composedMessage, ...formattedMsgs);
  }

  /**
   * Ghi log ở mức 'log'.
   */
  log(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'log', message);
  }
  /**
   * Ghi log ở mức 'error'.
   */
  error(message: any, ...optionalParams: any[]): any {
    const { messages, context, stack } = this.getContextAndStackAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'error', message, 'stderr');
    this.printStackTrace(stack);
  }

  /**
   * Ghi log ở mức 'warn'.
   */
  warn(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'warn', message);
  }

  /**
   * Ghi log ở mức 'debug'.
   */
  debug(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'debug', message);
  }

  /**
   * Ghi log ở mức 'verbose'.
   */
  verbose(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'verbose', message);
  }
}
