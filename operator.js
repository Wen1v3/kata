class Operator {
    compare() {
        throw new Error("Method 'compare' must be implemented.");
    }
}

class EqualToOperator extends Operator {
    compare(a, b) {
        return a == b;
    }
}

class GreaterThanOperator extends Operator {
    compare(a, b) {
        return a > b;
    }
}

class InOperator extends Operator {
    compare(a, b) {
        return b.includes(a);
    }
}

module.exports = { EqualToOperator, GreaterThanOperator, InOperator }