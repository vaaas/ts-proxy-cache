export default function make_cache<S extends Record<string|symbol, any>>(Store: S, T: number = 1*60*60*1000): S {
	const Timeouts: Partial<Record<keyof S, number>> = {}

	const Handler: ProxyHandler<S> = {
		get(store: S, key: keyof S): any {
			const now = Date.now()
			if (now > Timeouts[key]!) {
				delete Store[key]
				return undefined
			} else return store[key]
		},

		set<K extends keyof S>(store: S, key: K, value: S[K]): boolean {
			Store[key] = value
			Timeouts[key] = Date.now() + T
			return true
		},

		deleteProperty(store: S, key: keyof S): boolean {
			delete Timeouts[key]
			delete Store[key]
			return true
		},
	}

	return new Proxy(Store, Handler)
}
