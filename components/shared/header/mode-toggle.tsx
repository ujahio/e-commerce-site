"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, SunMoon } from "lucide-react";

const ModeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const iconToDisplay =
		theme === "system" ? (
			<SunMoon />
		) : theme === "dark" ? (
			<MoonIcon />
		) : (
			<SunIcon />
		);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					{iconToDisplay}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Appearance</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem
					checked={theme === "system"}
					onClick={() => setTheme("system")}
				>
					System
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "light"}
					onClick={() => setTheme("light")}
				>
					Light
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={theme === "dark"}
					onClick={() => setTheme("dark")}
				>
					Dark
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ModeToggle;
