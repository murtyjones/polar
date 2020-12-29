import createLnrpc from '@radar/lnrpc';
import inquirer from 'inquirer';
import Actor from './actor';
import { aliceLnd } from './config';
import { forever } from './utils';

type T = {
  action: keyof typeof Actor.answers;
};

(async () => {
  const lnrpc = await createLnrpc(aliceLnd);
  const actor = new Actor(lnrpc);
  const info = await lnrpc.getInfo();
  forever(async () => {
    const { action } = await inquirer.prompt<T>({
      type: 'list',
      name: 'action',
      message: `Hi ${info.alias}, what would you like to do?`,
      choices: actor.getChoices(),
    });
    const answer = await actor.getAnswer(action);
    console.log(answer);
  });
})();
