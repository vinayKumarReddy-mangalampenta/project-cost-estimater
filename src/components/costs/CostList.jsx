import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	IconButton,
	Heading,
	Flex,
	Button,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useToast,
	Text,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Input,
	InputGroup,
	InputLeftElement,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { deleteCost } from "../../features/costs/costsSlice";
import CostForm from "./CostForm";

const CostList = () => {
	const { costs, isLoading } = useSelector((state) => state.costs);
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const toast = useToast();

	// Search state
	const [searchQuery, setSearchQuery] = useState("");

	// Modal state
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedCost, setSelectedCost] = useState(null);

	// Delete confirmation dialog state
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [costToDelete, setCostToDelete] = useState(null);
	const cancelRef = React.useRef();

	const handleAdd = () => {
		setSelectedCost(null);
		onOpen();
	};

	const handleEdit = (cost) => {
		setSelectedCost(cost);
		onOpen();
	};

	const handleDeleteClick = (cost) => {
		setCostToDelete(cost);
		setIsDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		try {
			await dispatch(
				deleteCost({
					userId: user.uid,
					costId: costToDelete.id,
				})
			).unwrap();

			toast({
				title: "Cost deleted",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error deleting cost",
				description: error,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
		setIsDeleteDialogOpen(false);
	};

	// Filter costs based on search query
	const filteredCosts = costs.filter((cost) =>
		cost.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalCostsAmount = filteredCosts.reduce(
		(total, cost) => total + cost.amount,
		0
	);

	return (
		<Box mb={8}>
			<Flex justify="space-between" align="center" mb={6}>
				<Heading size="md">Additional Costs</Heading>
				<Button
					leftIcon={<AddIcon />}
					colorScheme="primary"
					size="sm"
					onClick={handleAdd}
				>
					Add Cost
				</Button>
			</Flex>

			<InputGroup mb={4}>
				<InputLeftElement pointerEvents="none">
					<SearchIcon color="gray.300" />
				</InputLeftElement>
				<Input
					placeholder="Search costs..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</InputGroup>

			{filteredCosts.length === 0 ? (
				<Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
					<Text color="gray.500">
						{searchQuery
							? "No costs match your search"
							: 'No additional costs added yet. Click "Add Cost" to get started.'}
					</Text>
				</Box>
			) : (
				<Box overflowX="auto">
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Description</Th>
								<Th isNumeric>Amount</Th>
								<Th width="100px">Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{filteredCosts.map((cost) => (
								<Tr key={cost.id}>
									<Td>{cost.description}</Td>
									<Td isNumeric>${cost.amount.toFixed(2)}</Td>
									<Td>
										<Flex gap={2}>
											<IconButton
												aria-label="Edit cost"
												icon={<EditIcon />}
												size="sm"
												variant="ghost"
												onClick={() => handleEdit(cost)}
											/>
											<IconButton
												aria-label="Delete cost"
												icon={<DeleteIcon />}
												size="sm"
												variant="ghost"
												colorScheme="red"
												onClick={() => handleDeleteClick(cost)}
											/>
										</Flex>
									</Td>
								</Tr>
							))}
							<Tr fontWeight="bold">
								<Td>Total Additional Costs</Td>
								<Td isNumeric>${totalCostsAmount.toFixed(2)}</Td>
								<Td></Td>
							</Tr>
						</Tbody>
					</Table>
				</Box>
			)}

			{/* Add/Edit Modal */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{selectedCost ? "Edit Cost" : "Add New Cost"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<CostForm editCost={selectedCost} onClose={onClose} />
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				isOpen={isDeleteDialogOpen}
				leastDestructiveRef={cancelRef}
				onClose={() => setIsDeleteDialogOpen(false)}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete Cost
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to delete "{costToDelete?.description}"?
							This action cannot be undone.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								onClick={() => setIsDeleteDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								onClick={handleDelete}
								ml={3}
								isLoading={isLoading}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Box>
	);
};

export default CostList;
