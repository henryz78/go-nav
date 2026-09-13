"use client";

import { useCallback, useSyncExternalStore } from "react";

const AUTO_REVEAL_OVERFLOW_STORAGE_KEY =
	"go-nav-user-auto-reveal-overflow-text";

const listeners = new Set<() => void>();
let cachedAutoRevealOverflow: boolean | undefined;

function readAutoRevealOverflowPreference(): boolean {
	if (typeof window === "undefined") return true;

	try {
		return (
			window.localStorage.getItem(AUTO_REVEAL_OVERFLOW_STORAGE_KEY) !==
			"false"
		);
	} catch {
		return true;
	}
}

function getAutoRevealOverflowSnapshot(): boolean {
	if (cachedAutoRevealOverflow === undefined) {
		cachedAutoRevealOverflow = readAutoRevealOverflowPreference();
	}
	return cachedAutoRevealOverflow;
}

function getAutoRevealOverflowServerSnapshot(): boolean {
	return true;
}

function emitPreferenceChange(): void {
	for (const listener of listeners) listener();
}

function handleStorageChange(event: StorageEvent): void {
	if (
		event.key !== null &&
		event.key !== AUTO_REVEAL_OVERFLOW_STORAGE_KEY
	) {
		return;
	}

	cachedAutoRevealOverflow = readAutoRevealOverflowPreference();
	emitPreferenceChange();
}

function subscribeAutoRevealOverflow(listener: () => void): () => void {
	listeners.add(listener);

	if (typeof window !== "undefined" && listeners.size === 1) {
		window.addEventListener("storage", handleStorageChange);
	}

	return () => {
		listeners.delete(listener);
		if (typeof window !== "undefined" && listeners.size === 0) {
			window.removeEventListener("storage", handleStorageChange);
		}
	};
}

function setAutoRevealOverflowPreference(enabled: boolean): void {
	cachedAutoRevealOverflow = enabled;

	if (typeof window !== "undefined") {
		try {
			if (enabled) {
				window.localStorage.removeItem(AUTO_REVEAL_OVERFLOW_STORAGE_KEY);
			} else {
				window.localStorage.setItem(
					AUTO_REVEAL_OVERFLOW_STORAGE_KEY,
					"false",
				);
			}
		} catch {
			// 浏览器禁用本地存储时仍保留当前会话内的设置。
		}
	}

	emitPreferenceChange();
}

export function useAutoRevealOverflowPreference(): readonly [
	boolean,
	(enabled: boolean) => void,
] {
	const enabled = useSyncExternalStore(
		subscribeAutoRevealOverflow,
		getAutoRevealOverflowSnapshot,
		getAutoRevealOverflowServerSnapshot,
	);
	const setEnabled = useCallback((next: boolean) => {
		setAutoRevealOverflowPreference(next);
	}, []);

	return [enabled, setEnabled] as const;
}
