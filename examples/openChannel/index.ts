import dotenv from 'dotenv';
import { ClientReadableStream, ServiceError } from 'grpc';
import {
  createLightning,
  createWalletUnlocker,
  GetInfoRequest,
  GetInfoResponse,
  Invoice,
  InvoiceSubscription,
  UnlockWalletRequest,
  UnlockWalletResponse,
} from 'lightning-rpc';

dotenv.config();

const config = {
  host: String(process.env.LND_HOST),
  port: String(process.env.LND_PORT),
  certPath: String(process.env.LND_CERT_PATH),
  macaroonPath: String(process.env.LND_MACAROON_PATH),
};

const walletUnlocker = createWalletUnlocker(config);

walletUnlocker.waitForReady(Infinity, (error: Error | null) => {
  if (error) {
    console.error(error);
  }

  const unlockWalletRequest = new UnlockWalletRequest();

  if (!process.env.LND_WALLET_PASSWORD) {
    throw 'No wallet password. Set the LND_WALLET_PASSWORD enviroment variable.';
  }

  unlockWalletRequest.setWalletPassword(Buffer.from(process.env.LND_WALLET_PASSWORD));

  walletUnlocker.unlockWallet(
    unlockWalletRequest,
    async (error: ServiceError | null, response: UnlockWalletResponse) => {
      if (error) {
        console.error(error);
      }
      console.log('Wallet unlocked');
      const lightning = await createLightning(config);

      lightning.waitForReady(Infinity, (error: Error | null) => {
        if (error) {
          throw error;
        }
        const getInfoRequest = new GetInfoRequest();
        lightning.getInfo(
          getInfoRequest,
          (error: ServiceError | null, response: GetInfoResponse) => {
            if (error) {
              console.error(error);
            }
            console.log(response);
          },
        );

        const invoiceSubscription = new InvoiceSubscription();
        const stream: ClientReadableStream<Invoice> = lightning.subscribeInvoices(
          invoiceSubscription,
        );
        stream.on('data', (invoice: Invoice) => {
          console.log('invoice', invoice);
        });
      });
    },
  );
});
