import Image from "next/image";
import loader from "@/assets/styles/loader.gif";

const LoadingPage = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				width: "100vw",
			}}
		>
			<Image
				src={loader}
				alt="Loading..."
				className="animate-spin"
				unoptimized
			/>
			<p className="text-lg text-gray-500 mt-4">Loading...</p>
		</div>
	);
};

export default LoadingPage;
