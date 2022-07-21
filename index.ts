type Cache = Record<string, any>
type CacheKey = keyof Cache

export default function make_cache(T: number = 1*60*60*1000): Cache {
	const Store: Cache = {}
	const Functions: Record<CacheKey, () => any> = {}
	const Timeouts: Record<CacheKey, number> = {}

	const Handler: ProxyHandler<Cache> = {
		get(store: Cache, key: CacheKey): any {
            if (!(key in Timeouts && key in Functions))
                return undefined
			const now = Date.now()
			if (now > Timeouts[key]!) {
				store[key] = Functions[key]!()
				Timeouts[key] = now + T
			}
			return store[key]
		},

		set(store: Cache, key: CacheKey, value: () => any): boolean {
			Functions[key] = value
			Timeouts[key] = 0
			return true
		},

		deleteProperty(store: Cache, key: CacheKey): boolean {
			Timeouts[key] = 0
			return true
		},
	}

	return new Proxy(Store, Handler)
}
