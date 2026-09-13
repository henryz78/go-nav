"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import { BiCog } from "react-icons/bi";
import { SubmissionSidebarButton } from "./submission-trigger";
import { UserSettingsDialog } from "./user-settings-dialog";

export function SidebarFooterActions({
	context,
	showSubmissionAction,
}: {
	context: "desktop" | "drawer";
	showSubmissionAction: boolean;
}) {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const inDrawer = context === "drawer";

	return (
		<>
			<div
				className={
					inDrawer
						? "shrink-0 px-2 pt-2"
						: "shrink-0 px-4 pt-4"
				}
			>
				<div className="flex items-center gap-2">
					{showSubmissionAction ? (
						<div className="min-w-0 flex-1">
							<SubmissionSidebarButton />
						</div>
					) : null}
					<Button
						isIconOnly
						variant="outline"
						aria-label="用户设置"
						className={`shrink-0 rounded-full ${showSubmissionAction ? "" : "ml-auto"}`}
						onPress={() => setSettingsOpen(true)}
					>
						<BiCog className="size-5" />
					</Button>
				</div>
			</div>

			<UserSettingsDialog
				isOpen={settingsOpen}
				onOpenChange={setSettingsOpen}
			/>
		</>
	);
}
