const printReceipt = require('./processReceipt');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const order = [];
readline.prompt();
readline.on('line', (cmd) => {
  order.push(cmd);
});

readline.on('close', function (cmd) {
  console.log('\n');
  console.log('-'.repeat(process.stdout.columns));
  console.log('Receipt:');
  console.log('_'.repeat(process.stdout.columns));
  printReceipt(order);

  process.exit(0);
});

console.clear();
console.log(
  'Please enter your new line separated order below (ctrl+c to enter):'
);
