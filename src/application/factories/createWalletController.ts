import { WalletController } from '../http/controllers/WalletController';
import { SoapClient } from '../../infrastructure/soap/SoapClient';

let walletController: WalletController | null = null;

export const getWalletController = (): WalletController => {
  if (!walletController) {
    const soapClient = new SoapClient();
    walletController = new WalletController(soapClient);
  }

  return walletController;
};
