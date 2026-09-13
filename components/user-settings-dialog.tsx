"use client";

import { Modal, Switch } from "@heroui/react";
import { BiCog } from "react-icons/bi";
import { useAutoRevealOverflowPreference } from "@/hooks/use-user-preferences";

export function UserSettingsDialog({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [autoRevealOverflow, setAutoRevealOverflow] =
		useAutoRevealOverflowPreference();

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
			<Modal.Container placement="auto" size="sm">
				<Modal.Dialog className="sm:max-w-md">
					<Modal.CloseTrigger />
					<Modal.Header className="gap-2">
						<Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
							<BiCog className="size-5" />
						</Modal.Icon>
						<Modal.Heading>设置</Modal.Heading>
					</Modal.Header>

					<Modal.Body className="p-6 mt-3!">
						<section aria-labelledby="display-settings-heading">
							<h3
								id="display-settings-heading"
								className="mb-2 text-xs font-semibold tracking-wide text-muted"
							>
								显示
							</h3>
							<div className="flex items-start justify-between gap-4 rounded-xl bg-default/50 p-4">
								<div className="min-w-0">
									<p className="text-sm font-medium text-foreground">
										自动展示被截断文字
									</p>
									<p className="mt-1 text-xs leading-5 text-muted">
										仅在网站名称或简介显示不完整时自动展示完整内容。
									</p>
								</div>
								<Switch
									aria-label="自动展示被截断文字"
									isSelected={autoRevealOverflow}
									onChange={setAutoRevealOverflow}
									className="shrink-0"
								>
									<Switch.Content>
										<Switch.Control>
											<Switch.Thumb />
										</Switch.Control>
									</Switch.Content>
								</Switch>
							</div>
						</section>
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	);
}
