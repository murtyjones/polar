import { LnRpc, Peer, WalletUnlockerRpc } from '@radar/lnrpc';

export default class NodeHandler {
  constructor(private lnrpc: LnRpc & WalletUnlockerRpc) {}

  getChoices = () => Object.keys(NodeHandler.answers);

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
    'See number of peers': (peerCount: number) => `You have ${peerCount} peers`,
    'List peers': (peers: Peer[]) =>
      `Your peers:\n\n`.concat(peers.map(e => e.address).join('\n')),
  };

  getAnswer = async (question: keyof typeof NodeHandler.answers) => {
    switch (question) {
      case 'See number of peers': {
        const seePeerCount = this.handlers[question];
        const peerCount: number = await seePeerCount();
        return NodeHandler.answers[question](peerCount);
      }
      case 'List peers': {
        const listPeers = this.handlers[question];
        const peers: Peer[] = await listPeers();
        return NodeHandler.answers[question](peers);
      }
      default:
        throw new Error('Question not recognized');
    }
  };
}
