class DiscountCalculator {
    constructor(operator, action, cartAttribute) {
        this._rule = "";
        this._items = [];
        this._operator = operator;
        this._action = action;
        this._cartAttribute = cartAttribute;
    }
    set rule(rule) {
        this._rule = rule;
    }
    set items(items) {
        this._items = items;
    }

    // return discount array for each sku
    calculate() {
        let result = this._items.map((x) => 0);

        let isConditionMet = true;
        if (Object.keys(this._rule.condition).length == 0) {
            // do nothing, let isConditionMet stays to be true
        } else {
            const cartAttribute = this._cartAttribute[this._rule.condition.cartAttribute].getValue(this.getSkusOfSubCart(this._rule.condition.subCartFilter), this._items);
            console.log("cartAttribute: " + cartAttribute);
            const value = this._rule.condition.value;
            isConditionMet = this._operator[this._rule.condition.operator].compare(cartAttribute, value);
        }
        console.log("isConditionMet: " + isConditionMet);

        if (!isConditionMet) {
            // do nothing, let result stays to be [0, ... 0]
        } else {
            // call action function to calculate discount array
            result = this._action[this._rule.action.code].getDiscountArray(this._rule.action.params, this.getSkusOfSubCart(this._rule.action.subCartFilter), this._items);
        }
        console.log("discountArray: " + JSON.stringify(result));
        return result;
    }

    // combine discount array from two rules, use bigger discount for each sku
    combine(discountsA, discountsB) {
        let result = discountsA.map((x) => 0);
        for (let i = 0; i < result.length; i++) {
            result[i] = discountsA[i] > discountsB[i] ? discountsA[i] : discountsB[i];
        } 
        //console.log(result);
        return result;
    }

    getSkusOfSubCart(subCartFilter) {
        if (Object.keys(subCartFilter).length == 0) return this._items.map((i) => i.sku);

        //console.log("subCartFilter: " + JSON.stringify(subCartFilter));

        let skus = [];
        for (let item of this._items) {
            const productAttribute = item[subCartFilter.productAttribute];
            const value = subCartFilter.value;
            if (this._operator[subCartFilter.operator].compare(productAttribute, value)) {
                skus.push(item.sku);
            }
        }
        return skus;
    }
}

module.exports = { DiscountCalculator }