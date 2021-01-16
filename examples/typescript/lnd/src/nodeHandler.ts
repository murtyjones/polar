import { LnRpc, WalletUnlockerRpc } from '@radar/lnrpc';
import inquirer from 'inquirer';

enum BaseAnswers {
  OpenChannel = 'Open a channel',
  ListPeers = 'List peers',
  ListPendingChannels = 'List open channels',
}

type Base = {
  action: BaseAnswers;
};

type OpenChannel = {
  action: string; // pubkey
};

export default class NodeHandler {
  constructor(private lnrpc: LnRpc & WalletUnlockerRpc) {}

  whatWouldYouLikeToDo = async () => {
    const info = await this.lnrpc.getInfo();
    const { action } = await inquirer.prompt<Base>({
      type: 'list',
      name: 'action',
      message: `Hi ${info.alias}, what would you like to do?`,
      choices: Object.values(BaseAnswers),
    });
    let answer = await this.getAnswer(action);
    while (typeof answer !== 'string') {
      answer = await answer();
    }
    console.log(answer);
    await this.whatWouldYouLikeToDo();
  };

  getAnswer = async (
    question: BaseAnswers,
  ): Promise<string | (() => Promise<string>)> => {
    switch (question) {
      case 'Open a channel': {
        return this.whichPeerToOpenWith;
      }
      case 'List peers': {
        const { peers } = await this.lnrpc.listPeers();
        return `Your peers:\n\n`.concat(peers.map(e => e.address).join('\n'));
      }
      case 'List open channels': {
        const info = await this.lnrpc.listChannels();
        return `Pending channels:\n${JSON.stringify(info)}`;
      }
      default:
        throw new Error('Question not recognized');
    }
  };

  whichPeerToOpenWith = async () => {
    const { peers } = await this.lnrpc.listPeers();
    const pubkey = await inquirer.prompt<{ action: string }>({
      type: 'list',
      name: 'action',
      message: 'Which peer would you like to open a channel with?',
      choices: peers.map(e => e.pubKey),
    });
    const amount = await inquirer.prompt<{ action: number }>({
      type: 'list',
      name: 'action',
      message: 'Which peer would you like to open a channel with?',
      choices: peers.map(e => e.pubKey),
    });
    await this.lnrpc.openChannelSync({
      nodePubkeyString: pubkey.action,
      localFundingAmount: amount.action.toString(),
    });
    return 'Request sent.';
  };
}
