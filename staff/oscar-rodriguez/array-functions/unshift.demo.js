console.log ("\n *** UNSHIFT DeMO ***");
var array = ["A", "B", "C", "D"];
var item = "E";

console.log("Our Array is: "+array);
console.log("Item to be added is: "+item);

console.log('That should print the array with the item at first place');
unshift (array, item);
console.log("Modified Array: "+array);

console.log('That should print the array with 3 new items');
unshift (array, 1, 2, 3);
console.log("Modified Array: "+array);