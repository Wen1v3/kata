class Action {
    getDiscountArray() {
        throw new Error("Method 'getDiscountArray' must be implemented.");
    }
}

class XForYAction extends Action {
    getDiscountArray(params, skusOfSubCart, items) {
        const [x, y] = params;
        return items.map((item) => {
            if (skusOfSubCart.includes(item.sku)) {
                const discount = Math.floor(item.qty / x) * (x * item.price - y);
                return discount > 0 ? discount : 0;
            } else {
                return 0;
            }
        });
    }
}

// Sample: get 50% off
class PercentOffAction extends Action {
    getDiscountArray(params, skusOfSubCart, items) {
        const [percentage] = params;
        return items.map((item) => {
            if (skusOfSubCart.includes(item.sku)) {
                return item.qty * item.price * percentage / 100;
            } else {
                return 0;
            }
        });
    }
}

// Sample: from the second (or X) item, get 50% off
class SecondOffAction extends Action {
    getDiscountArray(params, skusOfSubCart, items) {
        const [percentage, x] = params;
        let skippedNum = x;
        return items.map((item) => {
            if (skusOfSubCart.includes(item.sku)) {
                if (skippedNum >= item.qty) {
                    skippedNum = skippedNum - item.qty;
                    return 0;
                } else {
                    let result = (item.qty - skippedNum) * item.price * percentage / 100;
                    skippedNum = 0;
                    return result;
                }
            } else {
                return 0;
            }
        });
    }
}

module.exports = { XForYAction, PercentOffAction, SecondOffAction }