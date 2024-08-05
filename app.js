const { ItemLoader } = require('./item');
const { DiscountCalculator } = require('./discount');
const { RulesLoader } = require('./rule');
const { CartAdder } = require('./cart');
const { EqualToOperator, GreaterThanOperator, InOperator } = require('./operator');
const { XForYAction, PercentOffAction, SecondOffAction } = require('./action');
const { TotalQuantityCartAttribute, TotalAmountCartAttribute } = require('./cartAttribute');

class CheckOut {
    constructor(rules, itemLoader, cartAdder, discountCalculator) {
        this._rules = rules;
        this._items = [];
        this._itemLoader = itemLoader;
        this._cartAdder = cartAdder;
        this._discountCalculator = discountCalculator;
    }
    scan(item) {
        this._cartAdder.add(this._itemLoader.loadBySku(item));
        this._items = JSON.parse(JSON.stringify(this._cartAdder.items));
    }
    get items() {
        return this._items;
    }
    get total() {
        console.log(this._items);

        // calculate discount array for each rule, and combine them
        let discountArrayCombined = this._items.map((x) => 0);
        for (let rule of this._rules) {
            this._discountCalculator.rule = rule;
            this._discountCalculator.items = JSON.parse(JSON.stringify(this._items));
            const discountArray = this._discountCalculator.calculate();
            discountArrayCombined = this._discountCalculator.combine(discountArray, discountArrayCombined);
        }
        console.log("discountArray Combined: " + JSON.stringify(discountArrayCombined));

        return this._items.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.qty, 0,) -
            discountArrayCombined.reduce((accumulator, currentValue) => accumulator + currentValue, 0,);
    }
}

const rulesLoader = new RulesLoader();
const pricing_rules = rulesLoader.getRules();
const itemLoader = new ItemLoader();
const cartAdder = new CartAdder();
const operator = {
    equalTo: new EqualToOperator(),
    greaterThan: new GreaterThanOperator(),
    in: new InOperator(),
};
const action = {
    X_FOR_Y: new XForYAction(),
    PERCENT_OFF: new PercentOffAction(),
    SECOND_OFF: new SecondOffAction(),
};
const cartAttribute = {
    totalQuantity: new TotalQuantityCartAttribute(),
    totalAmount: new TotalAmountCartAttribute()
};
const discountCalculator = new DiscountCalculator(operator, action, cartAttribute);
const co = new CheckOut(pricing_rules, itemLoader, cartAdder, discountCalculator);
co.scan("A");
co.scan("A");
co.scan("A");
co.scan("B");
co.scan("C");
co.scan("C");
co.scan("C");
co.scan("D");
co.scan("D");
console.log(co.total);

module.exports = { CheckOut }