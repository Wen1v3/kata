class CartAttribute {
    getValue() {
        throw new Error("Method 'getValue' must be implemented.");
    }
}

class TotalQuantityCartAttribute extends CartAttribute {
    getValue(skusOfSubCart, items) {
        return items.filter(item => skusOfSubCart.includes(item.sku)).reduce((accumulator, currentValue) => accumulator + currentValue.qty, 0,);
    }
}

class TotalAmountCartAttribute extends CartAttribute {
    getValue(skusOfSubCart, items) {
        return items.filter(item => skusOfSubCart.includes(item.sku)).reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.qty, 0,);
    }
}

module.exports = { TotalQuantityCartAttribute, TotalAmountCartAttribute }