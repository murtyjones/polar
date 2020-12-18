import createLnrpc, { LnRpc, Peer, WalletUnlockerRpc } from '@radar/lnrpc';
import inquirer, { QuestionCollection } from 'inquirer';
import { aliceLnd } from './config';

type A = {
  action: string;
};

const choices = {
  '1. See number of peers': async (lnrpc: LnRpc & WalletUnlockerRpc) => {
    const info = await lnrpc.getInfo();
    return info.numPeers;
  },
  '2. List peers': async (lnrpc: LnRpc & WalletUnlockerRpc) => {
    const info = await lnrpc.listPeers();
    return info.peers;
  },
};

const answerPrefix = {
  '1. See number of peers': (answer: number | string) => {
    return `You have ${answer} peers`;
  },
  '2. List peers': (answer: Peer[]) => {
    return `Your peers:\n`.concat(answer.map(e => e.address).join('\n'));
  },
};

const makeQuestions = (alias: string): QuestionCollection<A> => [
  {
    type: 'list',
    name: 'action',
    message: `\nHi ${alias}, what would you like to do?`,
    choices: Object.keys(choices),
  },
];

(async function () {
  while (true) {
    const lnrpc = await createLnrpc(aliceLnd);

    const info = await lnrpc.getInfo();

    const questions = makeQuestions(info.alias);

    const { action } = await inquirer.prompt(questions);
    const key = action as keyof typeof choices;
    const result = await choices[key](lnrpc);
    const answer = answerPrefix[key];
    console.log(answer(result as any));
  }
})();
