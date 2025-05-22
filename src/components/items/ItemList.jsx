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
	Badge,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { deleteItem } from "../../features/items/itemsSlice";
import ItemForm from "./ItemForm";

const ItemList = () => {
	const { items, isLoading } = useSelector((state) => state.items);
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const toast = useToast();

	// Modal state
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedItem, setSelectedItem] = useState(null);

	// Delete confirmation dialog state
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);
	const cancelRef = React.useRef();

	const handleAdd = () => {
		setSelectedItem(null);
		onOpen();
	};

	const handleEdit = (item) => {
		setSelectedItem(item);
		onOpen();
	};

	const handleDeleteClick = (item) => {
		setItemToDelete(item);
		setIsDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		try {
			await dispatch(
				deleteItem({
					userId: user.uid,
					itemId: itemToDelete.id,
				})
			).unwrap();

			toast({
				title: "Item deleted",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error deleting item",
				description: error,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
		setIsDeleteDialogOpen(false);
	};

	const totalItemsCost = items.reduce((total, item) => total + item.cost, 0);

	return (
		<Box mb={8}>
			<Flex justify="space-between" align="center" mb={6}>
				<Heading size="md">Project Items</Heading>
				<Button
					leftIcon={<AddIcon />}
					colorScheme="primary"
					size="sm"
					onClick={handleAdd}
				>
					Add Item
				</Button>
			</Flex>

			{items.length === 0 ? (
				<Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
					<Text color="gray.500">
						No items added yet. Click "Add Item" to get started.
					</Text>
				</Box>
			) : (
				<Box overflowX="auto">
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th isNumeric>Cost</Th>
								<Th width="100px">Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{items.map((item) => (
								<Tr key={item.id}>
									<Td>{item.name}</Td>
									<Td isNumeric>${item.cost.toFixed(2)}</Td>
									<Td>
										<Flex gap={2}>
											<IconButton
												aria-label="Edit item"
												icon={<EditIcon />}
												size="sm"
												variant="ghost"
												onClick={() => handleEdit(item)}
											/>
											<IconButton
												aria-label="Delete item"
												icon={<DeleteIcon />}
												size="sm"
												variant="ghost"
												colorScheme="red"
												onClick={() => handleDeleteClick(item)}
											/>
										</Flex>
									</Td>
								</Tr>
							))}
							<Tr fontWeight="bold">
								<Td>Total Items Cost</Td>
								<Td isNumeric>${totalItemsCost.toFixed(2)}</Td>
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
						{selectedItem ? "Edit Item" : "Add New Item"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<ItemForm editItem={selectedItem} onClose={onClose} />
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
							Delete Item
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to delete "{itemToDelete?.name}"? This
							action cannot be undone.
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

export default ItemList;
