const { gst, pizzaSizePrices, toppingPrices } = require('./pricing');
const pizzaConfigs = {};

const calculatePizzaPrice = (toppings, sizeKey) => {
  subPrice = 0;
  subPrice += pizzaSizePrices[sizeKey];
  for (const topping of toppings) {
    if (topping in toppingPrices) {
      subPrice += toppingPrices[topping][sizeKey];
    }
  }
  return subPrice;
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
  const pizzaConfigurationPrize = calculatePizzaPrice(sortedToppings, sizeKey);

  const pizzaKey = sizeKey + sortedToppings.join();
  pizzaConfigs[pizzaKey] =
    pizzaKey in pizzaConfigs ? pizzaConfigs[pizzaKey] + 1 : 1;

  return pizzaConfigurationPrize;
};

const printPizzaConfigurationTotal = (pizza) => {};

const printOrderTotal = (subTotal) => {
  console.log('\n');
  console.log(`Subtotal: $${subTotal.toFixed(2)}`);
  console.log(`GST: $${(subTotal * gst).toFixed(2)}`);
  console.log(`Total: $${(subTotal * (1 + gst)).toFixed(2)}`);
};

const printReceipt = (order) => {
  subTotal = 0;
  for (let pizza of order) {
    pizza = pizza.trim().toLowerCase();
    const pizzaSize = getPizzaSize(pizza);
    subTotal += tallyPizzaOrder(pizza, pizzaSize);
  }
  printPizzaConfigurationTotal(pizza);
  printOrderTotal(subTotal);
};

module.exports = printReceipt;
