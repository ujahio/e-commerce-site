import {
	Select,
	SelectContent,
	SelectGroup,
	SelectTrigger,
} from "@/components/ui/select";
import { SelectItem, SelectValue } from "@radix-ui/react-select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const Search = async () => {
	const categories = await getAllCategories();
	return (
		<form action="/search" method="GET">
			<div className="flex w-full mx-w-sm items-center space-x-2">
				<Select name="category">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="All" key="all">
								All
							</SelectItem>
							{categories.map((x) => (
								<SelectItem key={x.category} value={x.category}>
									{x.category}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Input
					name="q"
					type="text"
					placeholder="Search..."
					className="md:w-[100px] lg:w-[300px]"
				/>
				<Button>
					<SearchIcon />
				</Button>
			</div>
		</form>
	);
};

export default Search;
