import * as soap from 'soap';

import { soapConfig } from '../../config/env';
import { logger } from '../utils/logger';
import { ServiceResponse } from '../../application/dto/responses';

export class SoapClient {
  private clientPromise: Promise<soap.Client> | null = null;

  private async getClient(): Promise<soap.Client> {
    if (!this.clientPromise) {
      logger.info(`Inicializando cliente SOAP con endpoint ${soapConfig.endpoint}`);
      this.clientPromise = soap.createClientAsync(soapConfig.endpoint);
    }

    return this.clientPromise;
  }

  async call<TInput extends Record<string, unknown>, TResult>(
    method: string,
    args: TInput,
  ): Promise<ServiceResponse<TResult>> {
    const client = await this.getClient();
    const operation = client[`${method}Async` as keyof soap.Client];

    if (typeof operation !== 'function') {
      throw new Error(`Operación SOAP ${method} no encontrada`);
    }

    const [result] = await (operation as (params: TInput) => Promise<unknown[]>)(args);

    const recordResult = (result ?? {}) as Record<string, unknown>;
    const key = `${method}Result`;

    if (!(key in recordResult)) {
      throw new Error(`Respuesta inesperada de SOAP para ${method}`);
    }

    return recordResult[key] as ServiceResponse<TResult>;
  }
}
