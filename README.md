# AutoFixture.js

AutoFixture.js is based off of Mark Seeman's [AutoFixture](https://github.com/AutoFixture/AutoFixture) for .NET.
The AutoFixture.js syntax attempts to match that of AutoFixture as much as possible where reasonable. You'll
find the syntax and functionality applicable to JavaScript very similar and easy to understand.

# Quick Start

For the examples below, I'm going to assume that `autofixture` has already been `require`'d and
assigned to the `fixture` variable.

## General Syntax

The general syntax provided by AutoFixture.js follows:

```javascript
var fixture = require('autofixture');
var instance = fixture.Create(ConstructorFunction[, args]);
```

What that means is that most of the constructor functions for the builtin JavaScript types are available.

## String Creation

To create a string we'd do the following:

```javascript
var myString = fixture.create(String);
// myString will look like a guid, e.g., '44CDC249-EAA2-4CC4-945C-B52475B0B0A9'
```

As with AutoFixture, we can also create a string that's prefixed by a value of our choosing. That's
done by passing in a string:

```javascript
var prefixedString = fixture.create('prefix');
// myString will look like a guid with our prefix. e.g.: 'prefix44CDC249-EAA2-4CC4-945C-B52475B0B0A9
```

## Number Creation

To create a Number we'd do the following:

```javascript
var myNumber = fixture.create(Number);
// myNumber will be a number between [0, 1). E.g., 0.59147235396
```

If we'd like a negative number or a larger number we can provide a multiplier:

```javascript
var myNegativeNumber = fixture.create(Number, -1);
// myNegativeNumber will be between (-1, 0]. E.g., -0.7982537387376
var myLargeNumber = fixture.create(Number, 500);
// mylargeNumber will be between [0, 500). E.g., 423.8746491657
var myLargeNegativeNumber = fixture.create(Number, -700);
// myLargeNegativeNumber will be between (-700, 0]. E.g., -672.451987454916
```

## Boolean Creation

To create a Boolean we can do the following:

```javascript
var myBoolean = fixture.create(Boolean);
// myBoolean will be either true or false.
```

## Object Creation

In JavaScript we frequently use objects and object literals and care not whether the object was
created with a constructor function. AutoFixture.js handles this by using a provided object as
a template, or specimen, for the object to be created.

To create an object that's similar to an existing object, just pass the object in to the `create`
method:

```javascript
var myObj = fixture.create({prop1:'a string', prop2: 1.234, prop3: true});
/*
myObj will look something like the following: 
{
  prop1: 'prop121032407-9216-404A-9F6A-021E8766AF21',
  prop2: 0.2518655981465,
  prop3: true
}
Each of the property values would be randomly chosen from the set of 
allowable values. In the case of properties that have strings as values
the string will be prefixed by the property name to allow the values to
be easily distinguishable.
*/
```