
describe('Hooray.prototype.findindex', function() {
    var arr = [1, 2, 3, 4, 5];

    it("Should returns the index of the first match", function() {

        var fn = function(element) { return element > 2; }
        expect(findIndex(arr, fn)).toBe(2);

    });


    it("Should returns -1 because there isn't match", function() {

        var fn = function(element) { return element > 20; }
        expect(findIndex(arr, fn)).toBe(-1);

    });

    it("Should returns throw and errar because expresion is wrong", function() {

        var fn = "pepito";
        expect(function() { findIndex(arr, fn) }).toThrowError(fn + " is not a function");

    });
})