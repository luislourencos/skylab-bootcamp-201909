// 1

function A() {}

A.prototype.salute = function() { return this.hello(); };
A.prototype.hello = function() { return 'hello world'; };

function B() {}

B.prototype = Object.create(A.prototype);
B.prototype.constructor = A;

B.prototype.hello = function() { return 'hola mundo'; };

var a = new A();
console.log(a.salute());

var b = new B();
console.log(b.salute());

// 2

function Person(name, surname, /*gender*/) {
	this.name = name;
	this.surname = surname;
	//this.gender = gender;
	//this.breath = function() { return 'sss sss sss'; };
}

Person.prototype.breath = function() { return 'sss sss sss'; };
Person.prototype.snore = function() { return 'RRR RRR RRR'; };
Person.prototype.sleep = function() { return 'Zzz Zzz Zzz'; };
Person.prototype.reproduce = function(person) {
	if (!(person instanceof Person)) throw Error('cannot reproduce');

	return this.create(person);
};
Person.prototype.create = function(person) {
	return new Person('', person.surname);
};

function Mars(name, surname) {
	Person.call(this, name, surname);
}

//Mars.prototype = new Person()
Mars.prototype = Object.create(Person.prototype);
Mars.prototype.constructor = Mars;

Mars.prototype.sitOnThrone = function() { return 'Plof... Plof...'; };
Mars.prototype.cry = function() { return 'Snif.'; };
/*Mars.prototype.reproduce = function(venus) {
	if (!(venus instanceof Venus)) throw Error('cannot reproduce');

	return Math.random() > .5? new Venus('', venus.surname) : new Mars('', venus.surname);
};*/
Mars.prototype.create = function(venus) {
	if (!(venus instanceof Venus)) throw Error('cannot reproduce');

	return Math.random() > .5? new Venus('', venus.surname) : new Mars('', venus.surname);
};

function Venus(name, surname) {
	Person.call(this, name, surname);
}

Venus.prototype = Object.create(Person.prototype);
Venus.prototype.constructor = Venus;

Venus.prototype.coordinate = function() { return 'Blah blah blah blah blah blah...'; };
Venus.prototype.eatMarsWithPotatoes = function() { return 'Ñam Ñam Ñam...'; };
/*Venus.prototype.reproduce = function(mars) {
	if (!(mars instanceof Mars)) throw Error('cannot reproduce');

	return Math.random() > .5? new Venus('', mars.surname) : new Mars('', mars.surname);
};*/
Venus.prototype.create = function(mars) {
	if (!(mars instanceof Mars)) throw Error('cannot reproduce');

	return Math.random() > .5? new Venus('', mars.surname) : new Mars('', mars.surname);
};

var john = new Mars('John', 'Doe');
var jane = new Venus('Jane', 'Doe');
var pepito = new Mars('Pepito', 'Doe');
var kevin = new Mars('Kevin', 'Doe');
var james = new Mars('James', 'Doe');
var mary = new Venus('Mary', 'Doe');
var jenny = new Venus('Jenny', 'Doe');
var vane = new Venus('Vane', 'Doe');
var chony = new Mars('Chony', 'Doe');
var yoli = new Venus('Yoli', 'Doe');
var juani = new Venus('Juani', 'Doe');
var merche = new Venus('Merche', 'Doe');

var people = [john, jane, pepito, kevin, james, mary, jenny, vane, chony, yoli, juani, merche];

/*console.log(john instanceof Mars);
console.log(john instanceof Venus);
console.log(john instanceof Person);

console.log(jane instanceof Venus);
console.log(jane instanceof Mars);
console.log(jane instanceof Person);*/

/*var males = people.reduce(function(accum, person) { 
	//person instanceof Mars && accum.push(person.name); 
	person.constructor.name === 'Mars' && accum.push(person.name); 

	return accum;
}, []);*/

console.log(john.reproduce(jane));
console.log(jane.reproduce(james));

var child = john.reproduce(jane);
child instanceof Venus? child.name = 'Venus' : child.name = 'Mars';