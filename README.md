# AutoFixture.js

AutoFixture.js is based off of Mark Seeman's [AutoFixture](https://github.com/AutoFixture/AutoFixture) for .NET.
The AutoFixture.js syntax attempts to match that of AutoFixture as much as possible where reasonable. You'll
find the syntax and functionality applicable to JavaScript very similar and easy to understand.

## Quick Start

```bash
npm install @timreynolds/autofixture
```

## General Syntax

For the examples below, I'm going to assume that `autofixture` has already been `require`'d and
assigned to the `fixture` constiable.

The general syntax provided by AutoFixture.js follows:

```javascript
const fixture = require('@timreynolds/autofixture');
const instance = fixture.Create(ConstructorFunction[, args]);
```

What that means is that most of the constructor functions for the builtin JavaScript types are available.

### String Creation

To create a string we'd do the following:

```javascript
const myString = fixture.create(String);
// myString will look like a guid, e.g., '44CDC249-EAA2-4CC4-945C-B52475B0B0A9'
```

As with AutoFixture, we can also create a string that's prefixed by a value of our choosing. That's
done by passing in a string:

```javascript
const prefixedString = fixture.create('prefix');
// myString will look like a guid with our prefix. e.g.: 'prefix44CDC249-EAA2-4CC4-945C-B52475B0B0A9
```

### Number Creation

To create a Number we'd do the following:

```javascript
const myNumber = fixture.create(Number);
// myNumber will be a number between [0, 1). E.g., 0.59147235396
```

If we'd like a negative number or a larger number we can provide a multiplier:

```javascript
const myNegativeNumber = fixture.create(Number, -1);
// myNegativeNumber will be between (-1, 0]. E.g., -0.7982537387376
const myLargeNumber = fixture.create(Number, 500);
// mylargeNumber will be between [0, 500). E.g., 423.8746491657
const myLargeNegativeNumber = fixture.create(Number, -700);
// myLargeNegativeNumber will be between (-700, 0]. E.g., -672.451987454916
```

### Boolean Creation

To create a Boolean we can do the following:

```javascript
const myBoolean = fixture.create(Boolean);
// myBoolean will be either true or false.
```

### Object Creation

#### Creation From a Like Object

In JavaScript we frequently use objects and object literals and care not whether the object was
created with a constructor function. AutoFixture.js handles this by using a provided object as
a template, or specimen, for the object to be created.

To create an object that's similar to an existing object, just pass the object in to the `create`
method:

```javascript
const myObj = fixture.create({prop1:'a string', prop2: 1.234, prop3: true});
/*
myObj will look something like the following: 
{
  prop1: 'prop121032407-9216-404A-9F6A-021E8766AF21',
  prop2: 0.2518655981465,
  prop3: true
}
*/
```

Each of the property values are randomly chosen from the set of allowable values. In the case of
properties that are of type string the string value will be prefixed by the property name to 
allow the values to be easily distinguishable.

#### Building Objects

When writing tests cases you often need to exclude a property or set it to a predetermined value. This is achived by using the `ObjectBuilder` exposed in AutoFixture.js via `build()`.

The builder provides the following methods;

* `like(template: {}): IObjectBuilder`
* `without(propName: string): IObjectBuilder`
* `with(propName: string, value: any): IObjectBuilder`

```javascript
const myObj = fixture
  .build()
  .like({prop1:'a string', prop2: 1.234, prop3: true})
  .without("prop1")
  .with("prop4", 'added property')
  .create();
/*
myObj will look something like the following: 
{
  prop2: 0.2518655981465,
  prop3: true,
  prop4: 'added property'
}
*/
```

#### Creation From a Constructor Function

Just as the builtin constructor functions can be used to create strings, numbers, and booleans,
custom constructor functions can be used to create other objects.

```javascript
function MyObjectType() {
    this.prop1 = '';
    this.prop2 = '';
    this.prop3 = 0;
    this.prop4 = false;
}
const myObj = fixture.create(MyObjectType);
/*
myObj will look something like the following:
{
  prop1: 'prop121032407-9216-404A-9F6A-021E8766AF21',
  prop2: 'prop27237F916-AAB4-40CF-814E-8BEC7181A70C',
  prop2: 0.98712634589712,
  prop3: true
}
*/
```

As with Like-Object creation described above, the instance values are assigned based on their
respective property types. Because `prop` and `prop2` are strings, they were assigned random
values prefixed by the property name.

## Type Definitions

Due to the dynamic return types of the library only relativly basic type definitions are included. These will be improved overtime from real world usage.

## Acknowledgements

This library is a TypeScript rewrite of [NextITCorp/AutoFixture.js](https://github.com/NextITCorp/AutoFixture.js). Credit to them for the original work which wasn't published to NPM.