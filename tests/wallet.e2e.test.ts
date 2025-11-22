import request from 'supertest';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { MockedFunction } from 'jest-mock';

import { createApp } from '../src/interfaces/http/server';
import { WalletController } from '../src/application/http/controllers/WalletController';
import { SoapClient } from '../src/infrastructure/soap/SoapClient';
import { ServiceResponse } from '../src/application/dto/responses';

type MockSoapClient = {
  call: MockedFunction<SoapClient['call']>;
};

describe('Wallet REST API', () => {
  let mockSoapClient: MockSoapClient;
  let controller: WalletController;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    mockSoapClient = {
      call: jest.fn() as MockedFunction<SoapClient['call']>,
    };

    controller = new WalletController(mockSoapClient as unknown as SoapClient);
    app = createApp(controller);
  });

  describe('POST /api/clients', () => {
    const route = '/api/clients';
    const payload = {
      document: '123456',
      fullName: 'John Doe',
      email: 'john@doe.com',
      phone: '5551234',
    };

    it('registers a client successfully', async () => {
      mockSoapClient.call.mockResolvedValue({
        success: true,
        codError: '00',
        messageError: 'ok',
        data: { client: { ...payload, balance: 0 } },
      });

      const response = await request(app).post(route).send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ success: true, codError: '00' });
      expect(mockSoapClient.call).toHaveBeenCalledWith('RegisterClient', {
        RegisterClientRequest: payload,
      });
    });

    it('returns validation error when payload is incomplete', async () => {
      const response = await request(app).post(route).send({ document: '123456' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ success: false, codError: '01' });
      expect(mockSoapClient.call).not.toHaveBeenCalled();
    });

    it('propagates business errors from SOAP response', async () => {
      mockSoapClient.call.mockResolvedValue({
        success: false,
        codError: '02',
        messageError: 'Duplicate document',
        data: null,
      });

      const response = await request(app).post(route).send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ success: false, codError: '02' });
    });

    it('returns 500 when SOAP client throws', async () => {
      mockSoapClient.call.mockRejectedValue(new Error('SOAP unavailable'));

      const response = await request(app).post(route).send(payload);

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ success: false, codError: '99' });
    });
  });

  describe('POST /api/wallet/recharge', () => {
    const route = '/api/wallet/recharge';
    const payload = {
      document: '123456',
      phone: '5551234',
      amount: 100,
    };

    it('recharges wallet successfully', async () => {
      mockSoapClient.call.mockResolvedValue({
        success: true,
        codError: '00',
        messageError: 'Recarga realizada correctamente',
        data: { newBalance: 200 },
      });

      const response = await request(app).post(route).send(payload);

      expect(response.status).toBe(200);
      expect(mockSoapClient.call).toHaveBeenCalledWith('RechargeWallet', {
        RechargeWalletRequest: payload,
      });
    });

    it('validates amount greater than zero', async () => {
      const response = await request(app).post(route).send({ ...payload, amount: 0 });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ success: false, codError: '01' });
    });
  });

  describe('POST /api/wallet/pay', () => {
    const route = '/api/wallet/pay';
    const payload = {
      document: '123456',
      phone: '5551234',
      amount: 50,
      description: 'Compra',
    };

    it('initiates payment and returns session info', async () => {
      mockSoapClient.call.mockResolvedValue({
        success: true,
        codError: '00',
        messageError: 'Token sent',
        data: { sessionId: 'session-1' },
      });

      const response = await request(app).post(route).send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ success: true, data: { sessionId: 'session-1' } });
      expect(mockSoapClient.call).toHaveBeenCalledWith('InitiatePayment', {
        InitiatePaymentRequest: payload,
      });
    });
  });

  describe('POST /api/wallet/confirm', () => {
    const route = '/api/wallet/confirm';
    const payload = {
      sessionId: 'session-1',
      token: '123456',
    };

    it('confirms payment successfully', async () => {
      mockSoapClient.call.mockResolvedValue({
        success: true,
        codError: '00',
        messageError: 'Pago confirmado',
        data: { newBalance: 50 },
      });

      const response = await request(app).post(route).send(payload);

      expect(response.status).toBe(200);
      expect(mockSoapClient.call).toHaveBeenCalledWith('ConfirmPayment', {
        ConfirmPaymentRequest: payload,
      });
    });
  });

  describe('GET /api/wallet/balance', () => {
    const route = '/api/wallet/balance';
    const query = {
      document: '123456',
      phone: '5551234',
    };

    it('retrieves wallet balance', async () => {
      mockSoapClient.call.mockResolvedValue({
        success: true,
        codError: '00',
        messageError: 'Consulta exitosa',
        data: { balance: 150 },
      });

      const response = await request(app).get(route).query(query);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ success: true, data: { balance: 150 } });
      expect(mockSoapClient.call).toHaveBeenCalledWith('GetWalletBalance', {
        GetWalletBalanceRequest: query,
      });
    });

    it('validates required query params', async () => {
      const response = await request(app).get(route).query({ document: '123456' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ success: false, codError: '01' });
    });
  });
});
