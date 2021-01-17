import { LnRpc, WalletUnlockerRpc } from '@radar/lnrpc';
import inquirer from 'inquirer';

enum BaseAnswers {
  OpenChannel = 'Open a channel',
  ListPeers = 'List peers',
  ListPendingChannels = 'List pending channels',
  ListOpenChannels = 'List open channels',
}

type Base = {
  action: BaseAnswers;
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
        return this.specifyChannelOpeningParameters;
      }
      case 'List peers': {
        const { peers } = await this.lnrpc.listPeers();
        return `Your peers:\n\n`.concat(peers.map(p => p.address).join('\n'));
      }
      case 'List pending channels': {
        const info = await this.lnrpc.pendingChannels();
        return `Pending channels:\n${JSON.stringify(info)}`;
      }
      case 'List open channels': {
        const info = await this.lnrpc.listChannels();
        return `Open channels:\n${JSON.stringify(info)}`;
      }
      default:
        throw new Error('Question not recognized');
    }
  };

  specifyChannelOpeningParameters = async () => {
    const { peers } = await this.lnrpc.listPeers();
    const { pubKey } = await inquirer.prompt<{ pubKey: string }>({
      type: 'list',
      name: 'pubKey',
      message: 'Which peer would you like to open a channel with?',
      choices: peers.map(e => e.pubKey),
    });
    const { amount } = await inquirer.prompt<{ amount: number }>({
      type: 'number',
      name: 'amount',
      message: 'How much would you like to open with?',
    });
    await this.lnrpc.openChannelSync({
      nodePubkeyString: pubKey,
      localFundingAmount: amount.toString(),
    });
    return 'Request sent.';
  };
}
