const rules = [
    {
        name: "X for Y if buy that",
        description: "Buy more than 3 of that tables, then for this chairs, you can get quantity 3 for $15.",
        condition: {
            cartAttribute: "totalQuantity",
            operator: "greaterThan",
            value: 3,
            subCartFilter: {
                productAttribute: "categoryId",
                operator: "equalTo",
                value: 1
            }
        },
        action: {
            code: "X_FOR_Y",
            subCartFilter: {
                productAttribute: "sku",
                operator: "in",
                value: ["C", "D"]
            },
            params: [3, 15]
        }
    }
];

class RulesLoader {
    getRules() {
        return rules;
    }
}

module.exports = { RulesLoader }