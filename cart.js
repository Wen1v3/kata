/*
A sample cart:
[                                                                                                                                                                                              
    { sku: 'B', price: 30, categoryId: 1, qty: 2 },
    { sku: 'D', price: 15, categoryId: 3, qty: 1 }
]
*/
class CartAdder {
    constructor() {
        this._items = [];
    }

    add(item) {
        let index = this._items.findIndex((element) => element.sku == item.sku);
        if (index == -1) {
            this._items.push({ ...item, qty: 1 });
        } else {
            this._items[index].qty += 1;
        }
    }
    get items() {
        return this._items;
    }
}

module.exports = { CartAdder }