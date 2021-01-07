const { calculatePizzaPrice, gst, toppingPrices } = require('./pricing');
const pizzaConfigs = {};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const getPizzaReceiptLabel = (sortedToppings, sizeKey) => {
  const size = { s: 'Small', m: 'Medium', l: 'Large' }[sizeKey];

  const toppingsWordCount = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
  ][sortedToppings.length];

  sortedToppings = sortedToppings.map((el) => el.capitalize());
  const lastTopping = sortedToppings.pop();
  const toppingsList = `${sortedToppings.join(', ')} and ${lastTopping}`;

  return `${size}, ${toppingsWordCount} Topping Pizza - ${toppingsList}`;
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
  const pizzaConfigurationPrice = calculatePizzaPrice(sortedToppings, sizeKey);

  const pizzaConfig = getPizzaReceiptLabel(sortedToppings, sizeKey);
  if (pizzaConfig in pizzaConfigs) {
    pizzaConfigs[pizzaConfig] = {
      ...pizzaConfigs[pizzaConfig],
      count: pizzaConfigs[pizzaConfig] + 1,
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
    console.log(`${count} ${config}: $${price.toFixed(2)}`);
  }
};

const printOrderTotal = (subTotal) => {
  console.log();
  console.log(`Subtotal: $${subTotal.toFixed(2)}`);
  console.log(`GST: $${(subTotal * gst).toFixed(2)}`);
  console.log(`Total: $${(subTotal * (1 + gst)).toFixed(2)}`);
};

const printReceipt = (order) => {
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
