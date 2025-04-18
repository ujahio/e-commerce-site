const ProductList = ({
	data,
	title,
	limit,
}: {
	data: any;
	title: string;
	limit?: number;
}) => {
	const renderProducts = () => {
		const limitedData = limit ? data.slice(0, 4) : data;
		if (data.length > 0) {
			return (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{limitedData.map((product: any) => {
						return <div key={product.name}>{product.name}</div>;
					})}
				</div>
			);
		}

		return (
			<div>
				<p className="text-center text-gray-500">No products found</p>
			</div>
		);
	};

	return (
		<div className="my-10">
			<h2 className="h2-bold mb-4">{title}</h2>
			{renderProducts()}
		</div>
	);
};

export default ProductList;
