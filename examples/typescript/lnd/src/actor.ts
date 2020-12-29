import { LnRpc, Peer, WalletUnlockerRpc } from '@radar/lnrpc';

export default class Actor {
  constructor(private lnrpc: LnRpc & WalletUnlockerRpc) {}

  getChoices = () => Object.keys(Actor.answers);

  listPeers = async () => {
    const info = await this.lnrpc.listPeers();
    return info.peers;
  };

  seePeerCount = async () => {
    const info = await this.lnrpc.getInfo();
    return info.numPeers;
  };

  handlers = {
    'See number of peers': this.seePeerCount,
    'List peers': this.listPeers,
  };

  public static answers = {
    'See number of peers': (x: number) => `You have ${x} peers`,
    'List peers': (peers: Peer[]) =>
      `Your peers:\n\n`.concat(peers.map(e => e.address).join('\n')),
  };

  getAnswer = async (question: keyof typeof Actor.answers) => {
    switch (question) {
      case 'See number of peers': {
        const result: number = await this.handlers[question]();
        return result;
      }
      case 'List peers': {
        const result: Peer[] = await this.handlers[question]();
        return result;
      }
      default:
        throw new Error('Question not recognized');
    }
  };
}
