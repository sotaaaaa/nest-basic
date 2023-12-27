import { APM_OPTIONS } from '../constants/elastic-apm.constant';
import { ApmFilter, ApmError } from '../types/elastic-apm.type';
import { Inject, Injectable, Logger } from '@nestjs/common';
import APM from 'elastic-apm-node';

/**
 * A service for interacting with Elastic APM.
 */
@Injectable()
export class ApmService {
  public instance: APM.Agent;
  public logger = new Logger(this.constructor.name);

  /**
   * Creates an instance of ApmService.
   * @param options - The configuration options for Elastic APM.
   */
  constructor(
    @Inject(APM_OPTIONS)
    private readonly options: APM.AgentConfigOptions,
  ) {
    this.logger.log('ApmPlugin initialized');
    this.instance = APM.start(options);
  }

  /**
   * Starts a new transaction.
   * @param name - The name of the transaction.
   * @param type - The type of the transaction.
   * @returns The started transaction.
   */
  public startTransaction(name: string | null, type: string | null): any {
    return this.instance.startTransaction(name, type);
  }

  /**
   * Adds a filter to the APM instance.
   * @param filter - The filter to be added.
   */
  public addFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.instance.addFilter(filter);
    } else {
      this.instance.addFilter(filter.filter);
    }
  }

  /**
   * Adds an error filter to the APM instance.
   * @param filter - The error filter to be added.
   */
  public addErrorFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.instance.addErrorFilter(filter);
    } else {
      this.instance.addErrorFilter(filter.filter);
    }
  }

  /**
   * Adds a transaction filter to the APM instance.
   * @param filter - The transaction filter to be added.
   */
  public addTransactionFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.instance.addTransactionFilter(filter);
    } else {
      this.instance.addTransactionFilter(filter.filter);
    }
  }

  /**
   * Adds a span filter to the APM instance.
   * @param filter - The span filter to be added.
   */
  public addSpanFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.instance.addSpanFilter(filter);
    } else {
      this.instance.addSpanFilter(filter.filter);
    }
  }

  /**
   * Captures an error and sends it to Elastic APM.
   * @param error - The error to be captured.
   */
  public captureError(error: ApmError): void {
    this.instance.captureError(error);
  }

  /**
   * Flushes any pending transactions and errors to Elastic APM.
   * @param callback - The callback function to be called after flushing.
   */
  public flush(callback: (err: Error) => void): void {
    this.instance.flush(callback);
  }

  /**
   * Sets the user context for the APM instance.
   * @param id - The user ID.
   * @param email - The user's email address.
   * @param username - The user's username.
   */
  public setUserContext(id?: string | number, email?: string, username?: string): void {
    this.instance.setUserContext({ id, email, username });
  }
}
