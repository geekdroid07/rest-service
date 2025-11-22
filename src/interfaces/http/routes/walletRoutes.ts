import { Router } from 'express';

import { getWalletController } from '../../../application/factories/createWalletController';
import { WalletController } from '../../../application/http/controllers/WalletController';

export const createWalletRouter = (controller?: WalletController) => {
  const router = Router();
  const walletController = controller ?? getWalletController();

  router.post('/clients', walletController.registerClient);
  router.post('/wallet/recharge', walletController.rechargeWallet);
  router.post('/wallet/pay', walletController.initiatePayment);
  router.post('/wallet/confirm', walletController.confirmPayment);
  router.get('/wallet/balance', walletController.getBalance);

  return router;
};

export const walletRouter = createWalletRouter();
