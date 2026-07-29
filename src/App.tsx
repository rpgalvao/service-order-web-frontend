import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
	return (
		<Layout>
			{/* Todo o conteúdo que colocarmos aqui dentro vai parar no {children} do Layout */}
			<Dashboard />
		</Layout>
	);
}
