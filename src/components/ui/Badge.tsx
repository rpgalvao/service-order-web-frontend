import type { ReactNode } from "react";

interface BadgeProps {
	children: ReactNode;
	variant?: "success" | "warning" | "danger" | "info" | "default";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
	// Adicionamos o whitespace-nowrap e o inline-flex para garantir o alinhamento
	const baseClasses =
		"px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap inline-flex items-center justify-center";

	const variants = {
		success:
			"bg-dwl-teal/10 text-dwl-teal border-dwl-teal/20 dark:border-dwl-teal/30 dark:text-dwl-cyan",
		warning:
			"bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:border-yellow-500/30 dark:text-yellow-500",
		danger: "bg-red-500/10 text-red-600 border-red-500/20 dark:border-red-500/30 dark:text-red-400",
		info: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:border-blue-500/30 dark:text-blue-400",
		default:
			"bg-gray-500/10 text-gray-600 border-gray-500/20 dark:border-gray-500/30 dark:text-gray-400",
	};

	return (
		<span className={`${baseClasses} ${variants[variant]}`}>
			{children}
		</span>
	);
}
