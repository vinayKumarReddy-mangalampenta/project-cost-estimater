import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Flex,
  useToast
} from '@chakra-ui/react';
import { addItem, updateItem } from '../../features/items/itemsSlice';

const ItemForm = ({ editItem = null, onClose = () => {} }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.items);
  const toast = useToast();
  
  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setCost(editItem.cost.toString());
    }
  }, [editItem]);
  
  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!cost) errors.cost = 'Cost is required';
    if (parseFloat(cost) <= 0) errors.cost = 'Cost must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const costFloat = parseFloat(cost);
    
    try {
      if (editItem) {
        await dispatch(updateItem({
          userId: user.uid,
          itemId: editItem.id,
          updatedItem: { name, cost: costFloat }
        })).unwrap();
        
        toast({
          title: 'Item updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(addItem({
          userId: user.uid,
          item: { name, cost: costFloat }
        })).unwrap();
        
        toast({
          title: 'Item added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Reset form
        setName('');
        setCost('');
      }
      
      onClose();
    } catch (error) {
      toast({
        title: editItem ? 'Error updating item' : 'Error adding item',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={!!formErrors.name} mb={4}>
        <FormLabel>Item Name</FormLabel>
        <Input
          placeholder="Enter item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormErrorMessage>{formErrors.name}</FormErrorMessage>
      </FormControl>
      
      <FormControl isInvalid={!!formErrors.cost} mb={6}>
        <FormLabel>Cost</FormLabel>
        <NumberInput min={0} precision={2}>
          <NumberInputField
            placeholder="Enter cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </NumberInput>
        <FormErrorMessage>{formErrors.cost}</FormErrorMessage>
      </FormControl>
      
      <Flex justifyContent="flex-end" gap={3}>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          colorScheme="primary"
          isLoading={isLoading}
        >
          {editItem ? 'Update Item' : 'Add Item'}
        </Button>
      </Flex>
    </form>
  );
};

export default ItemForm;