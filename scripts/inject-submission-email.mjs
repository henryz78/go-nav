#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dataDir = process.env.DATA_DIR
	? path.resolve(process.env.DATA_DIR)
	: path.join(root, "data");
const navPath = path.join(dataDir, "nav.json");
const email = process.env.SUBMISSION_EMAIL?.trim();

if (!email) {
	console.log("[submission-email] SUBMISSION_EMAIL 未设置，保留现有投稿邮箱配置");
	process.exit(0);
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
	console.error("[submission-email] SUBMISSION_EMAIL 不是有效邮箱格式，已停止构建");
	process.exit(1);
}

const nav = JSON.parse(fs.readFileSync(navPath, "utf8"));
nav.submission = {
	...(nav.submission ?? {}),
	staticEmail: email,
};

fs.writeFileSync(navPath, `${JSON.stringify(nav, null, 2)}\n`, "utf8");
console.log("[submission-email] ✔ 已注入投稿邮箱到构建配置");
