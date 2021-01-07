const expect = require('chai').expect;
const sinon = require('sinon');
require('mocha-sinon');

const printReceipt = require('../processReceipt');

describe('printReceipt()', function () {
  beforeEach(function () {
    this.sinon.stub(console, 'log');
  });

  afterEach(function () {
    this.sinon.restore();
  });

  it('should throw an error if no toppings are provided', function () {
    const noToppingsInput = 'Large - ';
    const printReceiptSpy = sinon.spy(printReceipt);
    try {
      printReceiptSpy([noToppingsInput]);
    } catch (e) {
      // pass
    }
    expect(printReceiptSpy).to.throw();
  });

  it('should work for the example in the README', function () {
    printReceipt([
      'Large -    Pepperoni,   Cheese,',
      'Medium -    pepperoni , Cheese',
      'Small -Pepperoni,Cheese',
    ]);

    const expectedLinebyLineOutput = [
      '1 Large, Two Topping Pizza - Cheese and Pepperoni: $18.00',
      '1 Medium, Two Topping Pizza - Cheese and Pepperoni: $15.50',
      '1 Small, Two Topping Pizza - Cheese and Pepperoni: $13.00',
      'Subtotal: $46.50',
      'GST: $2.33',
      'Total: $48.83',
    ];
    expect(console.log.callCount).to.equal(12);
    for (const output of expectedLinebyLineOutput) {
      expect(console.log.calledWith(output)).to.be.true;
    }
  });

  it('should work for one topping', function () {
    printReceipt(['Large -    Pepperoni']);

    const expectedLinebyLineOutput = [
      '1 Large, One Topping Pizza - Pepperoni: $17.00',
      'Subtotal: $17.00',
      'GST: $0.85',
      'Total: $17.85',
    ];
    for (const output of expectedLinebyLineOutput) {
      expect(console.log.calledWith(output)).to.be.true;
    }
  });

  it('should work for all toppings (case-insensitive)', function () {
    printReceipt([
      'large -    cheese, pepperoni,    hAM, pineaPPLe, sausaGE, feta cheese, TOMATOES, OliveS ',
    ]);

    const expectedLinebyLineOutput = [
      '1 Large, Eight Topping Pizza - Cheese, Feta cheese, Ham, Olives, Pepperoni, Pineapple, Sausage and Tomatoes: $36.00',
      'Subtotal: $36.00',
      'GST: $1.80',
      'Total: $37.80',
    ];
    for (const output of expectedLinebyLineOutput) {
      expect(console.log.calledWith(output)).to.be.true;
    }
  });

  it('should consider same configurations and tally them together', function () {
    printReceipt([
      'Large -    Pepperoni,   Cheese,',
      'Large -    Cheese, Pepperoni',
      'Medium -    pepperoni , Cheese, olives',
      'Medium -    pepperoni , olives,   Cheese',
      'Small -Pepperoni,Cheese',
      'Small -Pepperoni,Cheese',
      'Small -Pepperoni,Cheese',
      'Small -   Cheese',
    ]);

    const expectedLinebyLineOutput = [
      '2 Large, Two Topping Pizza - Cheese and Pepperoni: $36.00',
      '2 Medium, Three Topping Pizza - Cheese, Olives and Pepperoni: $37.00',
      '3 Small, Two Topping Pizza - Cheese and Pepperoni: $39.00',
      '1 Small, One Topping Pizza - Cheese: $12.50',
      'Subtotal: $124.50',
      'GST: $6.23',
      'Total: $130.73',
    ];
    expect(console.log.callCount).to.equal(13);
    for (const output of expectedLinebyLineOutput) {
      expect(console.log.calledWith(output)).to.be.true;
    }
  });
});
