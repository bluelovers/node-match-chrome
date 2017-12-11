/**
 * Created by user on 2017/12/11/011.
 */

import localDev, { relative, expect, path, assert } from './_local-dev';

import index from '..';

// @ts-ignore
describe(relative(__filename), () =>
{
	let currentTest;

	// https://developer.chrome.com/apps/match_patterns
	let tests = [
		[
			'http://*/*',
			[
				'http://www.google.com/',
				'http://example.org/foo/bar.html',
			],
		],
		[
			'http://*/foo*',
			[
				'http://example.com/foo/bar.html',
				'http://www.google.com/foo',
			],
		],
		[
			'https://*.google.com/foo*bar',
			[
				'https://www.google.com/foo/baz/bar',
				'https://docs.google.com/foobar',
			],
		],
		[
			'http://example.org/foo/bar.html',
			[
				'http://example.org/foo/bar.html',
			],
		],
		[
			'file:///foo*',
			[
				'file:///foo/bar.html',
				'file:///foo',
			],
		],
		[
			'http://127.0.0.1/*',
			[
				'http://127.0.0.1/',
				'http://127.0.0.1/foo/bar.html',
			],
		],
		[
			'*://mail.google.com/*',
			[
				'http://mail.google.com/foo/baz/bar',
				'https://mail.google.com/foobar',
			],
			[
				'*://mail.google.com/*',
			],
		],
		[
			'<all_urls>',
			[
				'http://example.org/foo/bar.html',
				'file:///bar/baz.html',
			],
			[
				'ftp://example.org/foo/bar.html',
				'ftp:///bar/baz.html',
			],
		],
	];

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

						expect(r).to.be.ok;
						assert.isOk(r);
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

						expect(r).to.be.not.ok;
						assert.isNotOk(r);
					});
				});
			}
		});
	});
});
