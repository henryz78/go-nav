/**
 * 保留现有函数签名以兼容上游调用链。
 * 个人版本不注入任何作者推广或联盟追踪参数。
 */
export function withAuthorBaiduTracking(rawUrl: string): string {
	return rawUrl;
}
