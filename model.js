var Foo = function(foo) {
	return { ymca: foo };
};

var Books = function(books) {
	return { books: books };
};

module.exports = { Foo, Books };

var Book = function(title,
	authors,
	isbn,
	stores,
	genre,
	description,
	reviews,
	price) {
	return {
		title: title,
		authors: authors,
		isbn: isbn,
		stores: stores,
		genre: genre,
		description: description,
		reviews: reviews,
		price: price
	};
};

var Author = function(
	name,
	description,
	books,
	website,
	image) {
	return {
		name: name,
		description: description,
		books: books,
		website: website,
		image: image
	};
};

var Store = function(
	name,
	address,
	state,
	phone,
	employees) {
	return {
		name: name,
		address: address,
		state: state,
		phone: phone,
		employees: employees
	};
};

var Employee = function(
	firstName,
	lastName,
	birthdate,
	address,
	phone,
	email,
	hireDate,
	store) {
	return {
		firstName: firstName,
		lastName: lastName,
		birthdate: birthdate,
		address: address,
		phone: phone,
		email: email,
		hireDate: hireDate,
		store: store
	};
};

var Client = function(
	name,
	address,
	phone,
	email) {
	return {
		name: name,
		address: address,
		phone: phone,
		email: email
	};
};

var BookSale = function(
	date,
	books,
	store,
	employee,
	client,
	totalAmount) {
	return {
		date: date,
		books: books,
		store: store,
		employee: employee,
		client: client,
		totalAmount: totalAmount
	};
};

var ClientReview = function(
	client,
	book,
	content,
	stars) {
	return {
		client: client,
		book: book,
		content: content,
		stars: stars
	};
};
