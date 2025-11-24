import { appConfig } from './env';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Wallet REST Service',
    version: '1.0.0',
    description: 'REST API bridge for wallet SOAP service',
  },
  servers: [
    {
      url: `http://localhost:${appConfig.port}`,
    },
  ],
  components: {
    schemas: {
      RegisterClientRequest: {
        type: 'object',
        properties: {
          document: { type: 'string' },
          fullName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
        },
        required: ['document', 'fullName', 'email', 'phone'],
      },
      RechargeRequest: {
        type: 'object',
        properties: {
          document: { type: 'string' },
          phone: { type: 'string' },
          amount: { type: 'number' },
        },
        required: ['document', 'phone', 'amount'],
      },
      InitiatePaymentRequest: {
        type: 'object',
        properties: {
          document: { type: 'string' },
          phone: { type: 'string' },
          amount: { type: 'number' },
        },
        required: ['document', 'phone', 'amount'],
      },
      ConfirmPaymentRequest: {
        type: 'object',
        properties: {
            token: { type: 'string' },
            sessionId: { type: 'string' },
        },
        required: ['sessionId', 'token'],
      },
      GetWalletBalanceRequest: {
        type: 'object',
        properties: {
            document: { type: 'string' },
            phone: { type: 'string' },
        },
        required: ['document', 'phone'],
      },
      BalanceResponse: {
        type: 'object',
        properties: {
          balance: { type: 'number' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          codError: { type: 'string' },
          messageError: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/clients': {
      post: {
        summary: 'Register a new client',
        tags: ['Clients'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterClientRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Client registered successfully' },
          '4XX': { description: 'Client error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/wallet/recharge': {
      post: {
        summary: 'Recharge wallet',
        tags: ['Wallet'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RechargeRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Wallet recharged' },
          '4XX': { description: 'Client error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/wallet/pay': {
      post: {
        summary: 'Initiate a payment from wallet',
        tags: ['Wallet'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/InitiatePaymentRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Payment initiated' },
          '4XX': { description: 'Client error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/wallet/confirm': {
      post: {
        summary: 'Confirm a payment',
        tags: ['Wallet'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConfirmPaymentRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Payment confirmed' },
          '4XX': { description: 'Client error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/wallet/balance': {
      get: {
        summary: 'Get wallet balance for client',
        tags: ['Wallet'],
        parameters: [
          {
            name: 'document',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'phone',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Current balance', content: { 'application/json': { schema: { $ref: '#/components/schemas/BalanceResponse' } } } },
          '4XX': { description: 'Client error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};

export default swaggerSpec;
