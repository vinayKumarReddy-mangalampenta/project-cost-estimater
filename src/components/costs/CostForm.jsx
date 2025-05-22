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
import { addCost, updateCost } from '../../features/costs/costsSlice';

const CostForm = ({ editCost = null, onClose = () => {} }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.costs);
  const toast = useToast();
  
  useEffect(() => {
    if (editCost) {
      setDescription(editCost.description);
      setAmount(editCost.amount.toString());
    }
  }, [editCost]);
  
  const validate = () => {
    const errors = {};
    if (!description.trim()) errors.description = 'Description is required';
    if (!amount) errors.amount = 'Amount is required';
    if (parseFloat(amount) <= 0) errors.amount = 'Amount must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const amountFloat = parseFloat(amount);
    
    try {
      if (editCost) {
        await dispatch(updateCost({
          userId: user.uid,
          costId: editCost.id,
          updatedCost: { description, amount: amountFloat }
        })).unwrap();
        
        toast({
          title: 'Cost updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(addCost({
          userId: user.uid,
          cost: { description, amount: amountFloat }
        })).unwrap();
        
        toast({
          title: 'Cost added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Reset form
        setDescription('');
        setAmount('');
      }
      
      onClose();
    } catch (error) {
      toast({
        title: editCost ? 'Error updating cost' : 'Error adding cost',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={!!formErrors.description} mb={4}>
        <FormLabel>Description</FormLabel>
        <Input
          placeholder="Enter cost description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormErrorMessage>{formErrors.description}</FormErrorMessage>
      </FormControl>
      
      <FormControl isInvalid={!!formErrors.amount} mb={6}>
        <FormLabel>Amount</FormLabel>
        <NumberInput min={0} precision={2}>
          <NumberInputField
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </NumberInput>
        <FormErrorMessage>{formErrors.amount}</FormErrorMessage>
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
          {editCost ? 'Update Cost' : 'Add Cost'}
        </Button>
      </Flex>
    </form>
  );
};

export default CostForm;