/**
 * Created by user on 2017/12/11/011.
 */

export interface IOptions
{
	skipHash?: boolean;
	skipQuery?: boolean;

	scheme?: string[],

	returnValue?: boolean;
}

export let defaultOptions = {
	skipHash: true,
	skipQuery: false,

	scheme: [
		'http',
		'https',
		'file',
	],
} as IOptions;

export function matchChrome(url, pattern, options?: IOptions)
{
	options = Object.assign({}, defaultOptions, options);

	if (Array.isArray(pattern))
	{
		for (let p of pattern)
		{
			let r = matchChrome(url, p, options);

			if (r)
			{
				return r;
			}
		}

		return null;
	}

	let pr = pattern_regex(pattern, options);
	let ret = pr.exec(url.toString());

	if (ret || options.returnValue)
	{



		return {
			value: ret,

			scheme: ret ? ret[1] : void(0),
			host: ret ? ret[2] : void(0),
			path: ret ? ret[3] : void(0),

			url: url,
			pattern: pattern,
			regex: pr,
		};
	}

	return ret;
}

export function pattern_regex<T = string>(pattern, options?: IOptions): RegExp
{
	options = Object.assign({}, defaultOptions, options);

	let flags = 'ig';

	pattern = pattern.toString();

	let ret;

	let r_scheme = '(' + options.scheme.join('|') + ')';
	let r_domain = '([^/]+)';
	let r_path = '(/(?:.+)?)?';

	if (pattern == '<all_urls>')
	{
		ret = `${r_scheme}(?:\\:\\/{2,3})${r_domain}${r_path}`;
	}
	else if (/\*/.test(pattern))
	{
		let _m = pattern.match(/^((?:[^\/]+)\:\/{2,3})?([^\/]+\/)*([^\/]+)?$/);

		if (_m)
		{
			_m[1] = r_scheme;

			if (typeof _m[2] === 'undefined')
			{
				r_domain = '(' + _pattern_regex(_m[3], '.*') + ')';
				r_path = '';
			}
			else
			{
				let _a = _m[2].split(/\//);

				r_domain = '(' + _pattern_regex(_a[0]) + ')';

				r_path = _pattern_regex(_a.slice(1).join('/'));

				_m[3] = (r_path ? '/' : '') + _m[3];

				if (_m[3])
				{
					if (/^\/+(\*)?$/g.test(_m[3]))
					{
						//r_path = '(?:\\\/.*|)';

						r_path = _m[3]
							.replace(/^\/+(\*)?$/g, '(?:\\/+$1|)')
							.replace(/\*/g, '.*')
						;
					}
					else
					{
						r_path += _pattern_regex(_m[3], '.*');
					}
				}

				r_path = r_path
					.replace(/\(\?\:\)/g, '')
					.replace(/([\/]+)$/, '(?:$1)?')
				;

				//console.log(_m[3], r_path);
			}

			ret = `${r_scheme}(?:\\:\\/{2,3})${r_domain}${r_path}`;
		}
		else
		{
			console.error(999999, pattern);

			throw pattern;

			// @ts-ignore
			return null;
		}
	}
	else
	{
		if (/\:\/{2,3}[^\/]+\/*$/g.test(pattern))
		{
			ret = `${_pattern_regex(pattern.replace(/\/+$/, ''))}(?:\\/*)`;
		}
		else
		{
			ret = `${_pattern_regex(pattern)}`;
		}
	}

	if (options.skipQuery)
	{
		ret += '(?:\\\?.*)?';
	}

	if (options.skipHash)
	{
		ret += '(?:#.*)?';
	}

	return new RegExp(`^${ret}$`, flags);
}

function _pattern_regex(pattern, all = '(?:[^\/]*)')
{
	if (typeof pattern != 'string')
	{
		return '';
	}

	return '(?:' + pattern
		.toString()
		.replace(/([\.\?\/\\\:])/ig, '\\$1')
		.replace(/\*/ig, all)
		+ ')'
		;
}

Object.defineProperty(matchChrome, 'defaultOptions', {
	get()
	{
		return defaultOptions;
	},
	set(newValue)
	{
		defaultOptions = newValue;
	},
});

// @ts-ignore
matchChrome.default = matchChrome;

// @ts-ignore
export default matchChrome;
