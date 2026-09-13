"use client";

import type { NavCategory } from "@/types";
import { IconView } from "../icon-view";
import { OverflowText } from "../overflow-text";

export function CategorySectionHeader({
	category,
	showDescription,
	isChild,
	withBottomSpacing,
}: {
	category: NavCategory;
	showDescription: boolean;
	isChild: boolean;
	withBottomSpacing: boolean;
}) {
	return (
		<div
			className={`px-3 flex items-center gap-2 ${isChild ? "text-sm" : "*:text-xl"} ${withBottomSpacing ? "mb-3" : ""}`}
		>
			<IconView
				icon={category.icon}
				size={isChild ? 16 : 20}
				className="align-text-bottom"
			/>
			<h2 className={`font-semibold text-nowrap ${isChild ? "text-lg" : ""}`}>
				{category.name}
			</h2>
			{showDescription && category.description ? (
				<OverflowText
					text={category.description}
					className="min-w-0 flex-1 text-sm! font-medium text-muted"
				/>
			) : null}
		</div>
	);
}
