const KV_KEY = "website.json";
const CACHE_TTL_SECONDS = 30;

export async function onRequestGet(context) {
	const kv = context.env.GO_NAV_KV;
	if (!kv) return context.next();

	try {
		const raw = await kv.get(KV_KEY, { cacheTtl: CACHE_TTL_SECONDS });
		if (!raw) return context.next();

		const website = JSON.parse(raw);
		if (!website || !Array.isArray(website.categories)) {
			throw new Error("KV 中的 website.json 必须包含 categories 数组");
		}

		return new Response(JSON.stringify(website), {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		console.error(`[go-nav-kv] 读取 ${KV_KEY} 失败，回退静态配置：`, error);
		return context.next();
	}
}
