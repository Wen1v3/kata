const items = [
    { sku: "A", price: 50, categoryId: 1 },
    { sku: "B", price: 30, categoryId: 1 },
    { sku: "C", price: 20, categoryId: 2 },
    { sku: "D", price: 15, categoryId: 3 }
];

class ItemLoader {
    loadBySku(sku) {
        return items.find((element) => element.sku == sku);
    }
}

module.exports = { ItemLoader }