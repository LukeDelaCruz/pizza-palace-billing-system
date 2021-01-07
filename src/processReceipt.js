const numToWordConverter = require('number-to-words');
const { calculatePizzaPrice, gst, toppingPrices } = require('./pricing');

let pizzaConfigs;

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const roundToNearestCent = (num) => {
  return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2);
};

const getPizzaReceiptLabel = (sortedToppings, sizeKey) => {
  const sortedToppingsLen = sortedToppings.length;
  const size = { s: 'Small', m: 'Medium', l: 'Large' }[sizeKey];
  const toppingsWordCount = numToWordConverter
    .toWords(sortedToppingsLen)
    .capitalize();
  sortedToppings = sortedToppings.map((el) => el.capitalize());

  let formattedToppingsString;
  if (sortedToppingsLen > 1) {
    const lastTopping = sortedToppings.pop();
    formattedToppingsString = `${sortedToppings.join(', ')} and ${lastTopping}`;
  } else {
    formattedToppingsString = sortedToppings[0];
  }

  return `${size}, ${toppingsWordCount} Topping Pizza - ${formattedToppingsString}`;
};

const getSortedToppings = (pizza) => {
  const hyphenMatch = /-\s*/g.exec(pizza);
  const firstIndexOfToppings = hyphenMatch.index + hyphenMatch[0].length;
  return pizza
    .substring(firstIndexOfToppings, pizza.length)
    .split(/\s*,\s*/)
    .filter((topping) => topping in toppingPrices)
    .sort((a, b) => a.localeCompare(b)); // ascending order
};

const getPizzaSize = (pizza) => {
  let sizeKey = '';

  pizza = pizza.toLowerCase();
  if (pizza.includes('large')) {
    sizeKey = 'l';
  } else if (pizza.includes('medium')) {
    sizeKey = 'm';
  } else if (pizza.includes('small')) {
    sizeKey = 's';
  }

  return sizeKey;
};

const tallyPizzaOrder = (pizza, sizeKey) => {
  if (pizza === '') {
    return;
  }

  const sortedToppings = getSortedToppings(pizza);

  const sortedToppingsLen = sortedToppings.length;
  if (sortedToppingsLen < 1) {
    throw new Error(`No toppings provided for a pizza!`);
  }

  const pizzaConfigurationPrice = calculatePizzaPrice(sortedToppings, sizeKey);

  const pizzaConfig = getPizzaReceiptLabel(sortedToppings, sizeKey);
  if (pizzaConfig in pizzaConfigs) {
    const newCount = pizzaConfigs[pizzaConfig].count + 1;
    pizzaConfigs[pizzaConfig] = {
      count: newCount,
      price: pizzaConfigurationPrice * newCount,
    };
  } else {
    pizzaConfigs[pizzaConfig] = {
      count: 1,
      price: pizzaConfigurationPrice,
    };
  }

  return pizzaConfigurationPrice;
};

const printPizzaConfigurationTotal = () => {
  for (const [config, { count, price }] of Object.entries(pizzaConfigs)) {
    console.log(`${count} ${config}: $${roundToNearestCent(price)}`);
  }
};

const printOrderTotal = (subTotal) => {
  console.log();
  console.log(`Subtotal: $${roundToNearestCent(subTotal)}`);
  console.log(`GST: $${roundToNearestCent(subTotal * gst)}`);
  console.log(`Total: $${roundToNearestCent(subTotal * (1 + gst))}`);
};

const printReceipt = (order) => {
  pizzaConfigs = {};

  console.log();
  console.log('-'.repeat(process.stdout.columns));
  console.log('Receipt:');
  console.log('_'.repeat(process.stdout.columns));
  subTotal = 0;
  for (let pizza of order) {
    pizza = pizza.trim().toLowerCase();
    const pizzaSize = getPizzaSize(pizza);
    subTotal += tallyPizzaOrder(pizza, pizzaSize);
  }
  printPizzaConfigurationTotal();
  printOrderTotal(subTotal);
  console.log('-'.repeat(process.stdout.columns));
};

module.exports = printReceipt;
