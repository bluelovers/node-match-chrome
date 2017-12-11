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

export interface IValue
{
	value: RegExpExecArray,

	scheme: string,
	host: string,
	path: string,

	url: string | any,
	pattern,
	regex: RegExp,
}

export let defaultOptions = {
	skipHash: true,
	skipQuery: false,

	scheme: [
		'http',
		'https',
		'file',
		'ftp',
	],

	returnValue: false,
} as IOptions;

export interface IMatchChrome extends Function
{

}

export interface IMatchChrome
{
	(url, pattern, options?: IOptions): IValue;

	defaultOptions?: IOptions;
	MatchPattern?: MatchPattern;
	matchChrome?: IMatchChrome;
}

export function matchChrome(url, pattern, options?: IOptions): IValue
{
	options = Object.assign({}, defaultOptions, options);

	if (Array.isArray(pattern))
	{
		for (let p of pattern)
		{
			let r = matchChrome(url, p, options);

			if (options.returnValue && !r.value)
			{
				continue;
			}

			if (r)
			{
				return r;
			}
		}

		return null;
	}

	let patternRegex = MatchPattern.makeRegexp(pattern, options);
	let ret = patternRegex.exec(url.toString());

	return MatchPattern.makeExecValue(ret, {
		url,
		pattern,
		patternRegex,
		options
	});
}

export class MatchPattern
{
	public pattern: RegExp[] = [];
	public options: IOptions = {};

	constructor(pattern, options?: IOptions)
	{
		this.pattern = MatchPattern.toRegExp(pattern, Object.assign(this.options, defaultOptions, options));
	}

	static create(pattern, options?: IOptions, ...argv)
	{
		return new this(pattern, options, ...argv);
	}

	exec(url, options?: IOptions)
	{
		options = Object.assign({}, this.options, options);

		for (let patternRegex of this.pattern)
		{
			let ret = patternRegex.exec(url.toString());

			if (ret)
			{
				return MatchPattern.makeExecValue(ret, {
					url,
					pattern: this.pattern,
					patternRegex,
					options
				});
			}
		}

		return null;
	}

	static makeExecValue(ret: RegExpExecArray, data: {
		url, pattern, patternRegex: RegExp, options: IOptions
	}, returnValue?: boolean)
	{
		if (ret || data.options.returnValue || returnValue)
		{
			return {
				value: ret || null,

				scheme: ret ? ret[1] : '',
				host: ret ? ret[2] : '',
				path: ret ? ret[3] : '',

				url: data.url,
				pattern: data.pattern,
				regex: data.patternRegex,
			} as IValue;
		}

		return null;
	}

	static makeRegexp<T = string>(pattern, options?: IOptions): RegExp
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

				ret = `${r_scheme}(?:\\:\\/{2,3})${r_domain}(${r_path})`;
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
			let _m = /^([^\/\:]+)\:\/{2,3}([^\/]+)(\/.*)?$/g.exec(pattern);

			if (_m)
			{
				let r_scheme = _pattern_regex(_m[1]);
				let r_domain = _pattern_regex(_m[2]);
				let r_path;

				//console.log(_m);

				if (typeof _m[3] == 'undefined')
				{
					r_path = '(?:\\/*)';
				}
				else if (_m[3] && /\/$/g.test(pattern))
				{
					r_path = _pattern_regex(_m[3].replace(/\/+$/, '')) + '(?:\\/*)';
				}
				else
				{
					r_path = _pattern_regex(_m[3]);
				}

				ret = `(${r_scheme})(?:\\:\\/{2,3})(${r_domain})(${r_path})`;
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
		}

		ret = ret.replace(/\(\?\:\)/g, '');

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

	static toRegExp(pattern, options?: IOptions)
	{
		let _options = Object.assign({}, defaultOptions, options);

		let arr: RegExp[] = [];

		if (Array.isArray(pattern))
		{
			for (let p of pattern)
			{
				let r = MatchPattern.makeRegexp(p, _options);
				arr.push(r);
			}
		}
		else
		{
			let r = MatchPattern.makeRegexp(pattern, _options);
			arr.push(r);
		}

		return arr;
	}
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
matchChrome.MatchPattern = MatchPattern;
// @ts-ignore
matchChrome.default = matchChrome.matchChrome = matchChrome as IMatchChrome;

// @ts-ignore
export default matchChrome as IMatchChrome;
