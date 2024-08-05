const { CheckOut } = require('./app');
const { ItemLoader } = require('./item');
const { CartAdder } = require('./cart');
const { EqualToOperator, GreaterThanOperator, InOperator } = require('./operator');
const { XForYAction, PercentOffAction, SecondOffAction } = require('./action');
const { TotalQuantityCartAttribute, TotalAmountCartAttribute } = require('./cartAttribute');
const { DiscountCalculator } = require('./discount');

const pricing_rules = [
    {
        name: "X for Y (A)",
        description: "",
        condition: {},
        action: {
            code: "X_FOR_Y",
            subCartFilter: {
                productAttribute: "sku",
                operator: "equalTo",
                value: "A"
            },
            params: [3, 130]
        }
    },
    {
        name: "X for Y (B)",
        description: "",
        condition: {},
        action: {
            code: "X_FOR_Y",
            subCartFilter: {
                productAttribute: "sku",
                operator: "equalTo",
                value: "B"
            },
            params: [2, 45]
        }
    }
];

const price = (goods, rules = pricing_rules) => {
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
    const co = new CheckOut(rules, itemLoader, cartAdder, discountCalculator);

    let chars = goods.split('');
    chars.forEach(element => {
        co.scan(element);
    });
    return co.total;
};

test('kata test_totals', () => {
    expect(price("")).toBe(0);
    expect(price("A")).toBe(50);
    expect(price("AB")).toBe(80);
    expect(price("CDBA")).toBe(115);

    expect(price("AA")).toBe(100);
    expect(price("AAA")).toBe(130);
    expect(price("AAAA")).toBe(180);
    expect(price("AAAAA")).toBe(230);
    expect(price("AAAAAA")).toBe(260);

    expect(price("AAAB")).toBe(160);
    expect(price("AAABB")).toBe(175);
    expect(price("AAABBD")).toBe(190);
    expect(price("DABABA")).toBe(190);
});

test('kata test_incremental', () => {
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
    expect(co.total).toBe(0);
    co.scan("A");  expect(co.total).toBe(50);
    co.scan("B");  expect(co.total).toBe(80);
    co.scan("A");  expect(co.total).toBe(130);
    co.scan("A");  expect(co.total).toBe(160);
    co.scan("B");  expect(co.total).toBe(175);
});

/*==========================================================*/
// This test focus on rules conflict
// all 20% off, some 50% off
const pricing_rules_all_some_off = [
    {
        name: "All Off",
        description: "X% off for all products",
        condition: {},
        action: {
            code: "PERCENT_OFF",
            subCartFilter: {},
            params: [20]
        }
    },
    {
        name: "Some Off",
        description: "X% off for some products",
        condition: {},
        action: {
            code: "PERCENT_OFF",
            subCartFilter: {
                productAttribute: "categoryId",
                operator: "in",
                value: [2, 3]
            },
            params: [50]
        }
    }
];

test('all 20% off, some 50% off', () => {
    expect(price("A", pricing_rules_all_some_off)).toBe(40);
    expect(price("AB", pricing_rules_all_some_off)).toBe(64);
    expect(price("ABC", pricing_rules_all_some_off)).toBe(74);
    expect(price("ABCD", pricing_rules_all_some_off)).toBe(81.5);
});

/*==========================================================*/
// This test focus on condition (cartAttribute)
// if total amount is greater than 100, then 20% off for all
const pricing_rules_total_amount_off = [
    {
        name: "Total Amount Off",
        description: "if total amount is greater than 100, then 20% off for all",
        condition: {
            cartAttribute: "totalAmount",
            operator: "greaterThan",
            value: 100,
            subCartFilter: {}
        },
        action: {
            code: "PERCENT_OFF",
            subCartFilter: {},
            params: [20]
        }
    }
];

test('if total amount is greater than 100, then 20% off for all', () => {
    expect(price("A", pricing_rules_total_amount_off)).toBe(50);
    expect(price("AB", pricing_rules_total_amount_off)).toBe(80);
    expect(price("ABC", pricing_rules_total_amount_off)).toBe(100);
    expect(price("ABCD", pricing_rules_total_amount_off)).toBe(92);
});

/*==========================================================*/
// This test focus on complex rules
// if total quantity of (A, B) is greater than 1, then 50% off for (C, D)
const pricing_rules_buy_this_get_that_off = [
    {
        name: "Buy This Get That Off",
        description: "if total quantity of (A, B) is greater than 1, then 50% off for (C, D)",
        condition: {
            cartAttribute: "totalQuantity",
            operator: "greaterThan",
            value: 1,
            subCartFilter: {
                productAttribute: "categoryId",
                operator: "equalTo",
                value: 1
            }
        },
        action: {
            code: "PERCENT_OFF",
            subCartFilter: {
                productAttribute: "sku",
                operator: "in",
                value: ["C", "D"]
            },
            params: [50]
        }
    }
];

test('if total quantity of (A, B) is greater than 1, then 50% off for (C, D)', () => {
    expect(price("A", pricing_rules_buy_this_get_that_off)).toBe(50); 
    expect(price("AC", pricing_rules_buy_this_get_that_off)).toBe(70); // 50 + 20
    expect(price("ABC", pricing_rules_buy_this_get_that_off)).toBe(90); // 50 + 30 + 20 * 50%
});

/*==========================================================*/
// This test focus on complex action
// For (A, B), from the second (or X) item, get 50% off
const pricing_rules_second_off = [
    {
        name: "Second (X) Off",
        description: "For (A, B), from second (X) item, 50% off",
        condition: {},
        action: {
            code: "SECOND_OFF",
            subCartFilter: {
                productAttribute: "sku",
                operator: "in",
                value: ["A", "B"]
            },
            params: [50, 1]
        }
    }
];

test('For (A, B), from second (X) item, 50% off', () => {
    expect(price("A", pricing_rules_second_off)).toBe(50); 
    expect(price("AA", pricing_rules_second_off)).toBe(75); // 50 + 50 * 50%
    expect(price("AB", pricing_rules_second_off)).toBe(65); // 50 + 30 * 50%
    expect(price("BA", pricing_rules_second_off)).toBe(55); // 30 + 50 * 50%
    expect(price("AC", pricing_rules_second_off)).toBe(70); // 50 + 20
    expect(price("AABBC", pricing_rules_second_off)).toBe(125); // 50 + (50 + 30 + 30 ) * 50% + 20
});