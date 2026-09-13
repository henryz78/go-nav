"use client";

import { Button } from "@heroui/react";
import { useSetAtom } from "jotai";
import { BiBookmarkPlus } from "react-icons/bi";
import { submissionDialogOpenAtom } from "@/lib/store/site";

export function SubmissionSidebarButton() {
	const setOpen = useSetAtom(submissionDialogOpenAtom);
	return (
		<Button
			fullWidth
			variant="outline"
			className="touch-manipulation justify-center"
			onPress={() => setOpen(true)}
		>
			<BiBookmarkPlus className="size-4" />
			投稿
		</Button>
	);
}
