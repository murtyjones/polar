import dotenv from 'dotenv';
import { AuthenticatedLNDgRPCArgs } from 'ln-service';

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

export const ALICE_LND_AUTH: AuthenticatedLNDgRPCArgs = {
  socket: String(process.env.ALICE_LND_HOST),
  cert: String(process.env.ALICE_CERT_B64),
  macaroon: String(process.env.ALICE_LND_MACAROON_B64),
};
