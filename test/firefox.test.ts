/**
 * Created by user on 2017/12/11/011.
 */

import localDev, { relative, expect, path, assert, util } from './_local-dev';

import index from '..';

// @ts-ignore
describe(relative(__filename), () =>
{
	let currentTest;

	/**
	 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Match_patterns
	 *
	 * @todo not yet support firefox mode
	 *
	 * @type {(string | string[])[][]}
	 */
	let tests = [
		[
			'*://*.mozilla.org/*',
			[
				'http://mozilla.org/',
				'https://mozilla.org/',
				'http://a.mozilla.org/',
				'http://a.b.mozilla.org/',
				'https://b.mozilla.org/path/',
			],
			[
				'ftp://mozilla.org/',
				'http://mozilla.com/',
				'http://firefox.org/',
			]
		],
		[
			'<all_urls>',
			[
				'http://example.org/',
				'ftp://files.somewhere.org/',
				'https://a.org/some/path/',
			],
			[
				'resource://a/b/c/',
			],
		],
	];

	before(function ()
	{
		index.defaultOptions.returnValue = true;
	});

	beforeEach(function ()
	{
		currentTest = this.currentTest;

		//console.log('it:before', currentTest.title);
		//console.log('it:before', currentTest.fullTitle());
	});

	tests.forEach(function (test)
	{
		describe(`${test[0]} ok`, () =>
		{
			if (test[1])
			{
				test[1].forEach(function (url)
				{
					it(`${url}`, function ()
					{
						//console.log(url, test[0]);

						let r = index(url, test[0]);

						console.log(r);

						//expect(r).to.be.ok;
						assert.isOk(r.value, util.inspect(r));
					});
				});
			}
		});

		describe(`${test[0]} fail`, () =>
		{
			if (test[2])
			{
				test[2].forEach(function (url)
				{
					it(`${url}`, function ()
					{
						//console.log(url, test[0]);

						let r = index(url, test[0]);

						console.log(r);

						//expect(r).to.be.not.ok;
						assert.isNotOk(r.value, util.inspect(r));
					});
				});
			}
		});
	});
});
