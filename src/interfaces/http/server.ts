import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { appConfig } from '../../config/env';
import { createWalletRouter } from './routes/walletRoutes';
import { WalletController } from '../../application/http/controllers/WalletController';
import { logger } from '../../infrastructure/utils/logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../../config/swagger';

export const createApp = (controller?: WalletController) => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use('/api', createWalletRouter(controller));

  // Swagger UI
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (_req: express.Request, res: express.Response) => {
    res.json(swaggerSpec);
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error', err);
    res.status(500).json({
      success: false,
      codError: '99',
      messageError: err.message,
      data: null,
    });
  });

  return app;
};

export const startHttpServer = () => {
  const app = createApp();

  app.listen(appConfig.port, () => {
    logger.info(`REST server running at http://localhost:${appConfig.port}`);
  });
};
