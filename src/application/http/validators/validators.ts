import { ERROR_CODES } from '../../constants/errorCodes';
import { ServiceResponse } from '../../dto/responses';

const buildValidationError = (message: string): ServiceResponse<null> => ({
  success: false,
  codError: ERROR_CODES.VALIDATION,
  messageError: message,
  data: null,
});

export const validateRegisterClient = (body: Record<string, unknown>) => {
  const { document, fullName, email, phone } = body;
  if (!document || !fullName || !email || !phone) {
    return buildValidationError('document, fullName, email y phone son requeridos');
  }
  return null;
};

export const validateRechargeWallet = (body: Record<string, unknown>) => {
  const { document, phone, amount } = body;
  if (!document || !phone || amount === undefined) {
    return buildValidationError('document, phone y amount son requeridos');
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return buildValidationError('amount debe ser mayor a 0');
  }
  return null;
};

export const validateInitiatePayment = (body: Record<string, unknown>) => {
  const { document, phone, amount } = body;
  if (!document || !phone || amount === undefined) {
    return buildValidationError('document, phone y amount son requeridos');
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return buildValidationError('amount debe ser mayor a 0');
  }
  return null;
};

export const validateConfirmPayment = (body: Record<string, unknown>) => {
  const { sessionId, token } = body;
  if (!sessionId || !token) {
    return buildValidationError('sessionId y token son requeridos');
  }
  return null;
};

export const validateGetBalance = (query: Record<string, unknown>) => {
  const { document, phone } = query;
  if (!document || !phone) {
    return buildValidationError('document y phone son requeridos');
  }
  return null;
};
