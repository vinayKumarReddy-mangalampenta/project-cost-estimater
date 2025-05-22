import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Box,
	Container,
	Heading,
	Spinner,
	Center,
	Divider,
	useToast,
} from "@chakra-ui/react";
import { fetchItems } from "../features/items/itemsSlice";
import { fetchCosts } from "../features/costs/costsSlice";
import ItemList from "../components/items/ItemList";
import CostList from "../components/costs/CostList";
import TotalCost from "../components/dashboard/TotalCost";

const Dashboard = () => {
	const { user } = useSelector((state) => state.auth);
	const { isLoading: itemsLoading, error: itemsError } = useSelector(
		(state) => state.items
	);
	const { isLoading: costsLoading, error: costsError } = useSelector(
		(state) => state.costs
	);
	const dispatch = useDispatch();
	const toast = useToast();

	useEffect(() => {
		if (user) {
			dispatch(fetchItems(user.uid));
			dispatch(fetchCosts(user.uid));
		}
	}, [dispatch, user]);

	useEffect(() => {
		if (itemsError) {
			toast({
				title: "Error loading items",
				description: itemsError,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}

		if (costsError) {
			toast({
				title: "Error loading costs",
				description: costsError,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	}, [itemsError, costsError, toast]);

	if (itemsLoading && costsLoading) {
		return (
			<Center h="calc(100vh - 64px)">
				<Spinner
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="primary.500"
					size="xl"
				/>
			</Center>
		);
	}

	return (
		<Container maxW="container.lg" py={8}>
			<Box mb={8} textAlign="center">
				<Heading size="lg" mb={2}>
					Project Cost Dashboard
				</Heading>
				<Divider />
			</Box>

			<TotalCost />

			<ItemList />

			<CostList />
		</Container>
	);
};

export default Dashboard;
