import ln from 'ln-service';
import { ALICE_LND_AUTH } from './config';

const openChannel = async (lnd: ln.AuthenticatedLND) => {
  const { peers } = await ln.getPeers({ lnd });
  const args: ln.OpenChannelArgs = {
    local_tokens: 100000,
    partner_public_key: peers[0].public_key,
  };
  return ln.openChannel({ lnd, ...args });
};

(async () => {
  const { lnd } = ln.authenticatedLndGrpc(ALICE_LND_AUTH);
  try {
    const { pending_channels } = await ln.getPendingChannels({ lnd });
    if (!pending_channels.length) {
      const { transaction_id } = await openChannel(lnd);
      console.log('No pending channels found, opened one: ', transaction_id);
    }
    console.log('Pending channels found: ', pending_channels.length);
  } catch (err) {
    console.error(err);
  }
})();
