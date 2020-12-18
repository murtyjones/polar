import { LnRpcClientConfig } from '@radar/lnrpc';
import dotenv from 'dotenv';

dotenv.config();

export function envString(name: string, fallback: string): string {
  const it = process.env[name];
  if (typeof it === 'string' && it.length > 0) {
    return it;
  }

  return fallback;
}

export function envNumber(name: string, fallback: number): number {
  const it = process.env[name];
  if (typeof it === 'string' && !isNaN(parseInt(it, 10))) {
    return parseInt(it, 10);
  }
  return fallback;
}

export function envBoolean(name: string, fallback: boolean): boolean {
  const it = process.env[name];
  if (typeof it === 'string' && (it === 'TRUE' || it === 'true')) {
    return true;
  }

  return fallback;
}

export const aliceLnd: LnRpcClientConfig = {
  server: String(process.env.ALICE_LND_HOST),
  tls: String(process.env.ALICE_TLS_CERT_PATH),
  macaroonPath: String(process.env.ALICE_LND_MACAROON_PATH),
};
