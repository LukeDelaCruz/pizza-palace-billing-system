const expect = require('chai').expect;
require('mocha-sinon');

const printReceipt = require('../processReceipt');

describe('printReceipt()', function () {
  beforeEach(function () {
    this.sinon.stub(console, 'log');
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
});
