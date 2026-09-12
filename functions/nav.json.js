const KV_KEY = "nav.json";
const CACHE_TTL_SECONDS = 30;

export async function onRequestGet(context) {
	const kv = context.env.GO_NAV_KV;
	if (!kv) return context.next();

	try {
		const raw = await kv.get(KV_KEY, { cacheTtl: CACHE_TTL_SECONDS });
		if (!raw) return context.next();

		const nav = JSON.parse(raw);
		if (!nav || typeof nav !== "object" || Array.isArray(nav)) {
			throw new Error("KV 中的 nav.json 顶层必须是 JSON 对象");
		}

		const submissionEmail = context.env.SUBMISSION_EMAIL?.trim() ?? "";
		nav.submission = {
			...(nav.submission ?? {}),
			staticEmail: submissionEmail,
		};

		return new Response(JSON.stringify(nav), {
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
