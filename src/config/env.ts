import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

export const appConfig = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
};

export const soapConfig = {
  endpoint: process.env.SOAP_ENDPOINT || 'http://localhost:4000/wsdl?wsdl',
};
