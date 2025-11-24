import { Request, Response } from 'express';

import { ServiceResponse } from '../../dto/responses';
import {
  validateConfirmPayment,
  validateGetBalance,
  validateInitiatePayment,
  validateRechargeWallet,
  validateRegisterClient,
} from '../validators/validators';
import { SoapClient } from '../../../infrastructure/soap/SoapClient';
import { ERROR_CODES } from '../../constants/errorCodes';

const buildInternalError = (message: string): ServiceResponse<null> => ({
  success: false,
  codError: ERROR_CODES.INTERNAL,
  messageError: message,
  data: null,
});

export class WalletController {
  constructor(private readonly soapClient: SoapClient) {}

  registerClient = async (req: Request, res: Response) => {
    const validation = validateRegisterClient(req.body);
    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      const response = await this.soapClient.call('RegisterClient', {
        RegisterClientRequest: req.body,
      });
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      debugger;
      res.status(500).json(buildInternalError((error as Error).message));
    }
  };

  rechargeWallet = async (req: Request, res: Response) => {
    const validation = validateRechargeWallet(req.body);
    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      const response = await this.soapClient.call('RechargeWallet', {
        RechargeWalletRequest: req.body,
      });
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json(buildInternalError((error as Error).message));
    }
  };

  initiatePayment = async (req: Request, res: Response) => {
    const validation = validateInitiatePayment(req.body);
    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      const response = await this.soapClient.call('InitiatePayment', {
        InitiatePaymentRequest: req.body,
      });
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json(buildInternalError((error as Error).message));
    }
  };

  confirmPayment = async (req: Request, res: Response) => {
    const validation = validateConfirmPayment(req.body);
    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      const response = await this.soapClient.call('ConfirmPayment', {
        ConfirmPaymentRequest: req.body,
      });
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json(buildInternalError((error as Error).message));
    }
  };

  getBalance = async (req: Request, res: Response) => {
    const validation = validateGetBalance(req.query as Record<string, unknown>);
    if (validation) {
      return res.status(400).json(validation);
    }

    try {
      const response = await this.soapClient.call('GetWalletBalance', {
        GetWalletBalanceRequest: req.query,
      });
      res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      res.status(500).json(buildInternalError((error as Error).message));
    }
  };
}
