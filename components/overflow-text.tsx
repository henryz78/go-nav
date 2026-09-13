"use client";

import { useEffect, useRef, useState } from "react";
import { useAutoRevealOverflowPreference } from "@/hooks/use-user-preferences";

const SCROLL_SPEED_PX_PER_SECOND = 30;
const START_HOLD_MS = 1400;
const END_HOLD_MS = 1000;

function observeSize(targets: Element[], onResize: () => void): () => void {
	if (typeof ResizeObserver !== "undefined") {
		const observer = new ResizeObserver(onResize);
		for (const target of targets) observer.observe(target);
		return () => observer.disconnect();
	}

	window.addEventListener("resize", onResize);
	return () => window.removeEventListener("resize", onResize);
}

export function OverflowText({
	text,
	className = "",
}: {
	text: string;
	className?: string;
}) {
	const [autoRevealEnabled] = useAutoRevealOverflowPreference();
	const containerRef = useRef<HTMLSpanElement>(null);
	const contentRef = useRef<HTMLSpanElement>(null);
	const animationRef = useRef<Animation | null>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		const content = contentRef.current;
		if (!container || !content) return;

		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const interactionTarget =
			container.closest<HTMLElement>("a, button, [tabindex]") ?? container;
		let animationFrame = 0;

		const cancelAnimation = () => {
			animationRef.current?.cancel();
			animationRef.current = null;
			content.style.transform = "";
		};

		const pauseAnimation = () => animationRef.current?.pause();
		const resumeAnimation = () => animationRef.current?.play();

		const measureAndAnimate = () => {
			cancelAnimation();
			const distance = Math.ceil(content.scrollWidth - container.clientWidth);
			const overflowing = distance > 1;
			setIsOverflowing(overflowing);

			if (!autoRevealEnabled || !overflowing || motionQuery.matches) return;

			const travelMs = Math.max(
				600,
				(distance / SCROLL_SPEED_PX_PER_SECOND) * 1000,
			);
			const duration = START_HOLD_MS + travelMs + END_HOLD_MS + travelMs;
			const startMoveOffset = START_HOLD_MS / duration;
			const endMoveOffset = (START_HOLD_MS + travelMs) / duration;
			const startReturnOffset =
				(START_HOLD_MS + travelMs + END_HOLD_MS) / duration;

			animationRef.current = content.animate(
				[
					{ transform: "translateX(0)", offset: 0 },
					{
						transform: "translateX(0)",
						offset: startMoveOffset,
						easing: "ease-in-out",
					},
					{
						transform: `translateX(-${distance}px)`,
						offset: endMoveOffset,
					},
					{
						transform: `translateX(-${distance}px)`,
						offset: startReturnOffset,
						easing: "ease-in-out",
					},
					{ transform: "translateX(0)", offset: 1 },
				],
				{
					duration,
					iterations: Number.POSITIVE_INFINITY,
					fill: "both",
				},
			);

			if (
				interactionTarget.matches(":hover") ||
				document.activeElement === interactionTarget
			) {
				pauseAnimation();
			}
		};

		const scheduleMeasure = () => {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(measureAndAnimate);
		};

		const stopObservingSize = observeSize(
			[container, content],
			scheduleMeasure,
		);
		motionQuery.addEventListener("change", scheduleMeasure);
		interactionTarget.addEventListener("pointerenter", pauseAnimation);
		interactionTarget.addEventListener("pointerleave", resumeAnimation);
		interactionTarget.addEventListener("focus", pauseAnimation);
		interactionTarget.addEventListener("blur", resumeAnimation);
		scheduleMeasure();

		return () => {
			cancelAnimationFrame(animationFrame);
			stopObservingSize();
			motionQuery.removeEventListener("change", scheduleMeasure);
			interactionTarget.removeEventListener("pointerenter", pauseAnimation);
			interactionTarget.removeEventListener("pointerleave", resumeAnimation);
			interactionTarget.removeEventListener("focus", pauseAnimation);
			interactionTarget.removeEventListener("blur", resumeAnimation);
			cancelAnimation();
		};
	}, [autoRevealEnabled, text]);

	return (
		<span
			ref={containerRef}
			className={`block overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
			title={autoRevealEnabled && isOverflowing ? text : undefined}
			data-overflowing={isOverflowing || undefined}
			data-auto-reveal={autoRevealEnabled || undefined}
		>
			<span ref={contentRef} className="inline-block min-w-max">
				{text}
			</span>
		</span>
	);
}

export function ClampedOverflowText({
	text,
	className = "",
}: {
	text: string;
	className?: string;
}) {
	const [autoRevealEnabled] = useAutoRevealOverflowPreference();
	const textRef = useRef<HTMLSpanElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const element = textRef.current;
		if (!element) return;

		let animationFrame = 0;
		const measure = () => {
			setIsOverflowing(
				element.scrollHeight > element.clientHeight + 1 ||
					element.scrollWidth > element.clientWidth + 1,
			);
		};
		const scheduleMeasure = () => {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(measure);
		};
		const stopObservingSize = observeSize([element], scheduleMeasure);
		scheduleMeasure();

		return () => {
			cancelAnimationFrame(animationFrame);
			stopObservingSize();
		};
	}, [text]);

	return (
		<span
			ref={textRef}
			className={className}
			title={autoRevealEnabled && isOverflowing ? text : undefined}
			data-overflowing={isOverflowing || undefined}
		>
			{text}
		</span>
	);
}
