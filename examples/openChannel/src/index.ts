import ln from 'ln-service';
import { ALICE_LND_AUTH } from './config';

(async () => {
  const { lnd } = ln.authenticatedLndGrpc(ALICE_LND_AUTH);
  try {
    const height = await ln.getHeight({ lnd });
    console.log(height);
  } catch (err) {
    console.error(err);
  }
})();
