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

readline.on('close', (cmd) => {
  printReceipt(order);
  process.exit(0);
});

console.clear();
console.log(
  'Please enter your new line (including final entry) separated order below (ctrl+c to enter):'
);
