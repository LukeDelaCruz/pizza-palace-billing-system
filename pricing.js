const gst = 0.05;

const pizzaSizePrices = {
  s: 12,
  m: 14,
  l: 16,
};

const toppingPrices = {
  // basic toppings
  cheese:    { s: 0.5, m: 0.75, l: 1.0 },
  pepperoni: { s: 0.5, m: 0.75, l: 1.0 },
  ham:       { s: 0.5, m: 0.75, l: 1.0 },
  pineapple: { s: 0.5, m: 0.75, l: 1.0 },

  // deluxe toppings
  sausage:    { s: 2.0, m: 3.0, l: 4.0 },
  fetaCheese: { s: 2.0, m: 3.0, l: 4.0 },
  tomatoes:   { s: 2.0, m: 3.0, l: 4.0 },
  olives:     { s: 2.0, m: 3.0, l: 4.0 },
};

module.exports = { gst, pizzaSizePrices, toppingPrices };
