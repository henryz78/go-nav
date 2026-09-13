"use client";

import type { Key } from "@heroui/react";
import { EmptyState, ListBox } from "@heroui/react";
import type { LayoutConfig } from "@/types";
import { SiteIcon } from "../site-icon";
import { OverflowText } from "../overflow-text";
import { SearchPanelShell } from "./search-panel-shell";
import type { SearchBarSite } from "./search-bar.types";
import { ACTIVE_LIST_ITEM_CLASS } from "../ui/ui.constants";
import { DROPDOWN_MAX_HEIGHT } from "./search-bar.utils";

export function SearchLocalResultsPanel({
	activeIndex,
	layout,
	onAction,
	results,
}: {
	activeIndex: number;
	layout?: HeaderLayout;
	onAction: (id: Key) => void;
	results: SearchBarSite[];
}) {
	return (
		<SearchPanelShell>
			<ListBox
				aria-label="搜索结果"
				onAction={onAction}
				className="overflow-y-auto p-1.5 overscroll-none"
				style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}
				renderEmptyState={() => <EmptyState>未找到匹配的网站</EmptyState>}
			>
				{results.map((result, index) => (
					<ListBox.Item
						key={`${result.categoryId}-${result.url}`}
						id={`${result.categoryId}-${result.url}`}
						textValue={result.title}
						data-keyboard-index={index}
						className={`px-2.5 py-1.5 min-h-12 shrink-0 ${
							activeIndex === index ? ACTIVE_LIST_ITEM_CLASS : ""
						}`}
					>
						<SiteIcon
							site={result}
							layout={layout}
							size={24}
							className="text-[11px]!"
							textClassName="text-[11px]!"
							initialClassName="text-[10px]!"
						/>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-1.5">
								<OverflowText
									text={result.title}
									className="min-w-0 flex-1 text-sm font-medium"
								/>
								<span className="min-w-0 max-w-28 shrink-0 rounded bg-default/80 px-1 py-px text-[10px]! font-medium text-muted leading-tight">
									<OverflowText text={result.categoryName} />
								</span>
							</div>
							<OverflowText
								text={result.description ?? ""}
								className="text-xs text-muted"
							/>
						</div>
						<ListBox.ItemIndicator />
					</ListBox.Item>
				))}
			</ListBox>
		</SearchPanelShell>
	);
}

type HeaderLayout = Pick<
	LayoutConfig,
	"defaultIconPadding" | "iconBorderRadius" | "linkTarget" | "autoUseIntranet"
>;
