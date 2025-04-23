import Link from "next/link";
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import {
	DropdownMenu,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.action";

const UserButton = async () => {
	const session = await auth();
	console.log("session", session);
	if (!session) {
		return (
			<>
				<Button asChild>
					<Link href="/sign-in">
						<UserIcon />
						Sign In
					</Link>
				</Button>
			</>
		);
	}

	const firstIntial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

	return (
		<div className="flex gap-2 items-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex items-center">
						<Button
							variant="ghost"
							className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
						>
							{firstIntial}
						</Button>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<div className="text-sm font-medium leading-none">
								{session.user?.name}
							</div>
							<div className="text-sm text-muted-foreground leading-none">
								{session.user?.email}
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuItem className="p-0 mb-1 mt-2">
						<div className="w-full">
							<Button
								className="w-full py-4 px-2 h-4 justify-start"
								variant="ghost"
								type="submit"
								onClick={signOutUser}
							>
								Sign Out
							</Button>
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default UserButton;
