import createLnrpc from '@radar/lnrpc';
import inquirer from 'inquirer';
import { ALICE_LND } from './config';
import NodeHandler from './nodeHandler';
import { forever } from './utils';

type Action = {
  action: keyof typeof NodeHandler.answers;
};

(async () => {
  const lnrpc = await createLnrpc(ALICE_LND);
  const nodeHandler = new NodeHandler(lnrpc);
  const info = await lnrpc.getInfo();
  forever(async () => {
    const { action } = await inquirer.prompt<Action>({
      type: 'list',
      name: 'action',
      message: `Hi ${info.alias}, what would you like to do?`,
      choices: nodeHandler.getChoices(),
    });
    const answer = await nodeHandler.getAnswer(action);
    console.log(answer);
  });
})();
