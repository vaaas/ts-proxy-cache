type Cache = Record<string, any>
type CacheKey = keyof Cache

export default function make_cache(T: number = 1*60*60*1000): Cache {
	const Store: Cache = {}
	const Timeouts: Record<CacheKey, number> = {}

	const Handler: ProxyHandler<Cache> = {
		get(store: Cache, key: CacheKey): any {
			const now = Date.now()
			if (now > Timeouts[key]!) {
				delete Store[key]
				return undefined
			} else return store[key]
		},

		set(store: Cache, key: CacheKey, value: () => any): boolean {
			Store[key] = value
			Timeouts[key] = Date.now() + T
			return true
		},

		deleteProperty(store: Cache, key: CacheKey): boolean {
			delete Timeouts[key]
			delete Store[key]
			return true
		},
	}

	return new Proxy(Store, Handler)
}
