# ValkeyGen

A Valkey key creation utility.

Create `Valkey Key Templates`, which include parameters, using a nested config object & use your `Valkey Key Template` strings to create Valkey Keys.

> This package uses [const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) which is available since [TypeScript 5.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html) so you need at least this version of Typescript for types in this package to properly work.

| ![npm](https://img.shields.io/npm/dm/valkeygen?style=for-the-badge) | [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/) | [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/alperguven) |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |

## Examples

[See it on action (StackBlitz)](https://stackblitz.com/edit/valkeygen?file=src/index.ts&view=editor)

Check [How to Use](#usage) section to see explanations of usage options on examples.

## Sections

- [Installation](#installation)
- [How It Works](#how-it-works)
- [How to Use](#usage)
  - [Option 1 (Recommended)](#option-1-recommended)
  - [Option 2](#option-2)
  - [Option 3 (Basic)](#option-2)
- [Documentation](#documentation)
  - [Terms](#documentation---terms)
  - [Functions](#documentation---functions)
- [FAQ](#faq)
- [Running Tests](#running-tests)
- [Local Development](#local-development)
- [Contributing](#contributing)

## Installation

Install [valkeygen](https://www.npmjs.com/package/valkeygen) with npm

This package both supports **ESM** and **CommonJS**.

```bash
  npm install valkeygen
```

Type definitions? Included!

## How It Works

Eventual purpose of this library is to create a `Valkey Key` (which is basically a string) using a template which we call in this library a `Valkey Key Template`.

Let's look at a simple example that demonstrates creating a blog-related key mapping. This example shows how to create keys for blog posts and their comments, illustrating the hierarchical nature of the key structure:

```typescript
// Create the keys mapping
const BlogKeys = createKeysMapping({
	SCOPE_FIRST_PART: ['blog'],
	posts: {
		SCOPE_FIRST_PART: ['posts'],
		byId: [defineKeyParameter('PostID')],
		comments: {
			SCOPE_FIRST_PART: [defineKeyParameter('PostID'), 'comments'],
			byId: [defineKeyParameter('CommentID')],
		},
	},
});

// Generate keys using the mapping
const postKey = generateKey(BlogKeys.posts.byId, {
	PostID: '1',
}); // Result: "blog:posts:1"

const commentKey = generateKey(BlogKeys.posts.comments.byId, {
	PostID: '1',
	CommentID: '123',
}); // Result: "blog:posts:1:comments:123"
```

There are 3 ways you can use this library.

- Create a `Valkey Keys Config` object.
- Create an object which has keys shaped as a `Valkey Key Template` and use it in conjunction with `generateKey()` to create Valkey keys.
- Just use `generateKey()` function by writing your `Valkey Key Template` as parameter to create a Valkey key.

There are detailed explanations for each of them down below.

## Usage

There are 3 ways you can use this library. Examples for different options show how you can get the same output using different methods.

> You will get parameter suggestions on your IDE based on the `Valkey Key Template` you provided to `generateKey()` function.

> All params on a `Valkey Key Template` are required. You will get type errors if you don't provide all of them.

First of all, import needed functions as follows:

```typescript
import { defineKeyParameter, createKeysMapping, generateKey } from 'valkeygen';
```

or using require

```javascript
var CRK = require('valkeygen');

const { defineKeyParameter, createKeysMapping, generateKey } = CRK;
```

### Option 1 (Recommended)

Create a `Valkey Keys Config` object.

> You should write `as const` at the end of the object for things to properly work.

```typescript
const valkeyKeysConfig = {
	SCOPE_FIRST_PART: [],

	appStatus: ['app-status'],

	restaurants: {
		SCOPE_FIRST_PART: ['RESTAURANTS'],
		byCategory: ['by-category', defineKeyParameter('CategoryID')],
		byCity: [defineKeyParameter('CityID')],
	},

	categories: {
		SCOPE_FIRST_PART: ['categories'],
		byID: [defineKeyParameter('CategoryID')],
	},

	users: {
		SCOPE_FIRST_PART: ['users'],
		online: ['online'],
		withActiveOrder: ['with-active-order'],
		byID: ['by-id', defineKeyParameter('UserID')],
	},

	couriers: {
		SCOPE_FIRST_PART: ['couriers'],
		Online: ['online'],
		OnDelivery: ['on-delivery'],
		byID: {
			SCOPE_FIRST_PART: ['by-id', defineKeyParameter('CourierID')],
			PreviousDeliveries: ['previous-deliveries'],
		},
	},

	orders: {
		SCOPE_FIRST_PART: ['orders'],
		byUser: ['of-user', defineKeyParameter('UserID')],
		byCity: {
			SCOPE_FIRST_PART: ['by-city', defineKeyParameter('CityName')],
			byCourier: ['of-courier', defineKeyParameter('CourierID')],
		},
	},
} as const;
```

Then create a `Valkey Keys Templates Map` using the config:

> If you give an invalid config, return type will be `never`. I explained why it works this way at [FAQ](#faq) section.

```typescript
const ValkeyKeysMap = createKeysMapping(exampleValkeyKeysConfig);
```

It will create a `Valkey Keys Templates Map`

```js
{
  appStatus: 'app-status',
  restaurants: {
    byCategory: 'RESTAURANTS:by-category:%CategoryID%',
    byCity: 'RESTAURANTS:%CityID%',
  },
  categories: {
    byID: 'categories:%CategoryID%',
  },
  users: {
    online: 'users:online',
    withActiveOrder: 'users:with-active-order',
    byID: 'users:by-id:%UserID%',
  },
  couriers: {
    Online: 'couriers:online',
    OnDelivery: 'couriers:on-delivery',
    byID: {
      PreviousDeliveries: 'couriers:by-id:%CourierID%:previous-deliveries',
    },
  },
  orders: {
    byUser: 'orders:of-user:%UserID%',
    byCity: {
      byCourier: 'orders:by-city:%CityName%:of-courier:%CourierID%',
    },
  },
}
```

You can then use this map to create a Valkey key when needed:

This will produce `couriers:by-id:1234:previous-deliveries`

```typescript
const previousDeliveriesOfCourierRK = generateKey(ValkeyKeysMap.couriers.byID.PreviousDeliveries, {
	CourierID: '1234',
});
```

Create another key using map:

This will produce `orders:by-city:istanbul:of-courier:1234`

```typescript
const latestOrdersOfCourierInCityRK = generateKey(ValkeyKeysMap.orders.byCity.byCourier, {
	CourierID: '1234',
	CityName: 'istanbul',
});
```

### Option 2

Instead of creating a `Valkey Keys Templates Map` using `createKeysMapping()` with a config, you can write it yourself.

> You should write `as const` at the end of the object for things to properly work.

> When you write `Valkey Key Templates` manually, be aware that it is much more error prone than using `Option 1`.

```typescript
const DeliveryServiceValkeyKeyTemplatesMap = {
	appStatus: 'app-status',
	restaurantsByCategory: 'RESTAURANTS:by-category:%CategoryID%',
	users: 'users:with-active-order',
	previousDeliveriesOfCourier: 'couriers:by-id:%CourierID%:previous-deliveries',
	latestOrdersOfCourierInCity: 'orders:by-city:%CityName%:of-courier:%CourierID%',
} as const;
```

Then you can use it just like shown on Option 1:

This will produce `orders:by-city:istanbul:of-courier:1234`

```typescript
const latestOrdersOfCourierInCityRK = generateKey(DeliveryServiceValkeyKeyTemplatesMap.latestOrdersOfCourierInCity, {
	CourierID: '1234',
	CityName: 'istanbul',
});
```

### Option 3

This is most basic usage of this package.

You can just write your `Valkey Key Template` as a parameter:

This will produce `orders:by-city:istanbul:of-courier:1234`

```typescript
const latestOrdersOfCourierInCityRK = generateKey('orders:by-city:%CityName%:of-courier:%CourierID%', {
	CourierID: '1234',
	CityName: 'istanbul',
});
```

## Documentation

### Documentation - Terms

#### Valkey Key Template

A string to be used as a template to create a Valkey key.

Format: `a-key-part:%ParamName1%:another-key-part:%ParamName2%`

#### Valkey Key Param

A part of `Valkey Key Template` which represents a variable part of the key.

Format: `%ParamName%`

#### Valkey Key Part

A part of `Valkey Key Template` which is either a `Valkey Key Param` or a `string`

Formats: `%ParamName%` | `random-text`

#### Valkey Keys Config Template Array

An array of `Valkey Key Part`

```typescript
const exampleTemplateArray = ['key1', defineKeyParameter('Param1')];
```

#### Valkey Keys Config Scope

Main building block of the a `Valkey Keys Config`.

- It has to have a key named `SCOPE_FIRST_PART` which is a `Valkey Keys Config Template Array`
- Other keys can be either a `Valkey Keys Config Template Array` or a `Valkey Keys Config Scope`

```typescript
const exampleScope = {
	SCOPE_FIRST_PART: [],
	key0: ['key0'],
	key1: ['key1', defineKeyParameter('Param1')],
	key2: ['key2', defineKeyParameter('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', defineKeyParameter('Param3')],
		scopedKey1: ['a-key-1'],
		scopedKey2: ['a-key-2', defineKeyParameter('KeyParam')],
	},
};
```

#### Valkey Keys Config

A config object to create `Valkey Keys Template Map`

- This is actually a `Valkey Keys Config Scope`

```typescript
const exampleValkeyKeysConfig = {
	SCOPE_FIRST_PART: [],
	key1: ['a-random-text-1', defineKeyParameter('Param1')],
	key2: ['another-text', defineKeyParameter('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', defineKeyParameter('Param3')],
		scopedKey1: ['a-key-1', defineKeyParameter('KeyParam')],
	},
} as const;
```

#### Valkey Keys Template Map

This is the product of `createKeysMapping()` function.

Given the following config to `createKeysMapping()` function:

```typescript
const exampleValkeyKeysConfig = {
	SCOPE_FIRST_PART: [],
	key1: ['a-random-text-1', defineKeyParameter('Param1')],
	key2: ['another-text', defineKeyParameter('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', defineKeyParameter('Param3')],
		scopedKey1: ['a-key-1', defineKeyParameter('KeyParam')],
	},
} as const;
```

When you use this config to create a map:

```typescript
createKeysMapping(exampleValkeyKeysConfig);
```

It will produce this object which is a `Valkey Keys Template Map`:

```javascript
{
	key1: 'a-random-text-1:%Param1%';
	key2: 'another-text:%Param2%';
	aNestedScope: {
		scopedKey1: 'a-nested-scope:%Param3%:a-key-1:%KeyParam%';
	}
}
```

You can then use it with `generateKey()` to create Valkey keys as needed.

### Documentation - Functions

#### defineKeyParameter

`defineKeyParameter(paramName: string)`

Creates a `Valkey Key Param` object.

It can be used in a `Valkey Keys Config Template Array` when creating `Valkey Keys Config`

```typescript
const exampleValkeyKeysConfig = {
	SCOPE_FIRST_PART: ['micro-service', defineKeyParameter('ServiceID')],
	key1: ['a-random-text-1', defineKeyParameter('Param1')],
	key2: ['another-text', defineKeyParameter('Param2'), 'another-part', defineKeyParameter('Param3')],
} as const;
```

#### createKeysMapping

```typescript
createKeysMapping(
  valkeyKeysConfig: Record<string, any>,
  optionalDelimiter: string | null
)
```

Creates a `Valkey Keys Template Map` using a `Valkey Keys Config` object.

Default delimiter is colon (`:`)

If you don't want to use a delimiter, give an empty string (`''`) to `optionalDelimiter` parameter.

> For most cases (like 95% of them), you will use a delimiter. Therefore I chose the most commonly used one (colon `:`), which is also used in official Valkey tutorials, as the default delimiter.

> `valkeyKeysConfig` should be given as the example below. Otherwise you won't get suggestions on `generateKey()` and also Typescript will give an error when you try to provide parameter values.

> `readonly ValkeyKeysConfig` does not work. Only way is to write `as const` at the end of the config object.

Given the config following config:

```typescript
// a Valkey Keys Config
const exampleValkeyKeysConfig = {
	SCOPE_FIRST_PART: [],
	key1: ['a-random-text-1', defineKeyParameter('Param1')],
	key2: ['another-text', defineKeyParameter('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', defineKeyParameter('Param3')],
		scopedKey1: ['a-key-1', defineKeyParameter('KeyParam')],
	},
} as const;
```

And called as follows:

```typescript
const exampleValkeyKeysTemplateMap = createKeysMapping(exampleValkeyKeysConfig);
```

It will produce this object which is a `Valkey Keys Template Map`:

```javascript
{
	key1: 'a-random-text-1:%Param1%';
	key2: 'another-text:%Param2%';
	aNestedScope: {
		scopedKey1: 'a-nested-scope:%Param3%:a-key-1:%KeyParam%';
	}
}
```

#### generateKey

```typescript
generateKey(
  valkeyKeyTemplateString: string,
  params: Record<string, string>
): string
```

Creates a Valkey key using a `Valkey Key Template` and replacing parameters on template with given parameter values.

```typescript
const blogPostCommentRepliesRK = generateKey('posts:%PostID%:comments:%CommentID%:replies', {
	PostID: '1234',
	CommentID: '9876',
});
```

This creates a `string` which equals to `posts:1234:comments:9876:replies`

## FAQ

No FAQ yet.

## Running Tests

To run tests, run the following command:

```bash
  npm run test
```

## Local Development

This an NPM package.

- When you make changes,
  - Build the project.
  - Create a new empty project.
  - [Link the local build to your test project](https://docs.npmjs.com/cli/v11/commands/npm-link).
  - Use your development version on your test project to see if it is working.
  - Write tests to verify that your new feature is working properly and also doesn't break anything.

## Contributing

Contributions are always welcome!

There are some basic rules though.

- **Be sure you don't break any existing type definitions.**
  - Developer Experience of this library depends on Typescript types.
  - Any change you make on type definitions might cause performance issues.
- **If you create a new Typescript type, write tests for it.**
  - Yes, really. Typescript is complicated and it isn't enough if it seems like it's working.
  - Check [TSD](https://www.npmjs.com/package/tsd) package to see how you can test types.
- **Write tests for your new feature.**
  - I won't accept any PR without additional tests.
  - I won't accept any PR if it can't pass existing tests.

## Authors

- [@alper-guven](https://www.github.com/alper-guven)

## License

[MIT](https://choosealicense.com/licenses/mit/)
