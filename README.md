# match-chrome

> A module for testing URLs against match chrome patterns

## options

```javascript
defaultOptions = {
	skipHash: true,
	skipQuery: false,

	scheme: [
		'http',
		'https',
		'file',
	],

	returnValue: false,
}
```

## use

import matchChrome from 'match-chrome';

matchChrome('http://127.0.0.1', 'http://127.0.0.1/*') // ok

## demo

see [test](test/)
