import { useSelector } from "react-redux";
import React from "react";

import {
	Box,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatGroup,
	Divider,
	Flex,
	Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const TotalCost = () => {
	const { items } = useSelector((state) => state.items);
	const { costs } = useSelector((state) => state.costs);

	const totalItemsCost = items.reduce((total, item) => total + item.cost, 0);
	const totalOtherCosts = costs.reduce((total, cost) => total + cost.amount, 0);
	const grandTotal = totalItemsCost + totalOtherCosts;

	const itemsPercentage =
		grandTotal === 0 ? 0 : (totalItemsCost / grandTotal) * 100;
	const otherCostsPercentage =
		grandTotal === 0 ? 0 : (totalOtherCosts / grandTotal) * 100;

	return (
		<MotionBox
			p={6}
			bg="white"
			borderRadius="lg"
			boxShadow="md"
			mb={8}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<StatGroup mb={4}>
				<Stat>
					<StatLabel fontSize="lg" color="gray.600">
						Total Project Cost
					</StatLabel>
					<StatNumber fontSize="4xl" color="primary.500" fontWeight="bold">
						${grandTotal.toFixed(2)}
					</StatNumber>
					<StatHelpText>
						{items.length} items + {costs.length} additional costs
					</StatHelpText>
				</Stat>
			</StatGroup>

			<Divider mb={4} />

			<Flex justify="space-between" mb={2}>
				<Box>
					<Stat>
						{" "}
						<StatLabel>Items Cost</StatLabel>
						<StatNumber fontSize="xl">${totalItemsCost.toFixed(2)}</StatNumber>
					</Stat>
				</Box>
				<Badge
					colorScheme="blue"
					alignSelf="flex-start"
					px={2}
					py={1}
					borderRadius="md"
				>
					{itemsPercentage.toFixed(1)}%
				</Badge>
			</Flex>

			<Flex justify="space-between">
				<Box>
					<Stat>
						<StatLabel>Other Costs</StatLabel>
						<StatNumber fontSize="xl">${totalOtherCosts.toFixed(2)}</StatNumber>
					</Stat>
				</Box>
				<Badge
					colorScheme="orange"
					alignSelf="flex-start"
					px={2}
					py={1}
					borderRadius="md"
				>
					{otherCostsPercentage.toFixed(1)}%
				</Badge>
			</Flex>
		</MotionBox>
	);
};

export default TotalCost;
