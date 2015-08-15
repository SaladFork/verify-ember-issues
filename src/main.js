import chalk from 'chalk';
import RSVP from 'rsvp';

import { getIssues as getRepoIssues } from './github';
import { getIssues as getSheetIssues } from './google-spreadsheet';

RSVP.hash({
  sheetIssues: getSheetIssues(process.env.SHEET_KEY),
  repoIssues: getRepoIssues('emberjs/ember.js')
}).then(({sheetIssues, repoIssues}) => {
  sheetIssues.byNumber = sheetIssues.reduce((hash, issue) => {
      hash[issue.number] = issue;
      return hash;
    }, {});

  let passCount = 0;

  repoIssues.forEach((repoIssue) => {
    const number = repoIssue.number;

    const stack = [];
    let failed = false;

    stack.push(chalk.white(`issue #${number}`));

    const actual = sheetIssues.byNumber[number];
    if (!actual) {
      stack.push(fail(`is not present`));
      failed = true;
    }

    if (!failed) {
      Object.keys(repoIssue).forEach((prop) => {
        if (actual[prop] !== repoIssue[prop]) {
          stack.push(fail(`doesn't have matching ${prop}`));
          stack.push(info(`  expected: ${repoIssue[prop]}`));
          stack.push(info(`    actual: ${actual[prop]}`));
          failed = true;
        }
      });
    }

    if (failed) {
      console.log(stack.join('\n'));
      console.log();
    } else {
      passCount++;
    }

  });

  console.log(`${repoIssues.length} open issues (${passCount} matching in spreadsheet)`);
}).catch(console.error);

function pass(msg) {
  return chalk.green('  ✔') + chalk.gray(` ${msg}`);
}

function fail(msg) {
  return chalk.red('  ✘') + chalk.gray(` ${msg}`);
}

function info(msg) {
  return chalk.gray(`   ${msg}`);
}
