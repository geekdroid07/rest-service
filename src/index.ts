import { startHttpServer } from './interfaces/http/server';
import { logger } from './infrastructure/utils/logger';

try {
  startHttpServer();
} catch (error) {
  logger.error('Error al iniciar el servidor REST', error);
  process.exit(1);
}
