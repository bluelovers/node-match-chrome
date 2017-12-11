/**
 * Created by user on 2017/12/11/011.
 */

import { util } from '~/test/_local-dev';
import localDev, { relative, expect, path, assert } from './_local-dev';

import index from '..';

// @ts-ignore
describe(relative(__filename), () =>
{
	let currentTest;

	beforeEach(function ()
	{
		currentTest = this.currentTest;

		//console.log('it:before', currentTest.title);
		//console.log('it:before', currentTest.fullTitle());
	});

	let tests = [
		[
			'127.0.0.1',
			[
				'http://127.0.0.1//',
				'http://127.0.0.1',
				'http://127.0.0.1/',
			],
		],
	];

	describe(`check regex`, () =>
	{
		tests.forEach(function (test)
		{
			it(`${test[0]}`, function ()
			{
				//console.log(url, test[0]);

				let ps = index.MatchPattern.create(test[1]);

				let p0 = ps.pattern[0] as RegExp;

				for (let p of ps.pattern)
				{
					//console.log(p, [p.source, p.flags]);

					expect(p).to.be.deep.equal(p0);
					expect(p.flags).to.be.equal(p0.flags);
					expect(p.source).to.be.equal(p0.source);
				}
			});
		});
	});
});
