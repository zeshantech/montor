// src/components/Layout/Header.tsx

import { Box, Flex, Heading, Spacer, Stack } from "@chakra-ui/react";
import ColorModeSwitcher from "../UI/ColorModeSwitcher";
import { UserButton } from "@clerk/clerk-react";

const Header = () => {
  return (
    <Box as="header" bg="teal.500" px={4} py={2} color="white">
      <Flex alignItems="center">
        <Heading size="md">DevOps Dashboard</Heading>
        <Spacer />
        <Stack gap={1} direction={'row'}>
          <UserButton />
          <ColorModeSwitcher />
        </Stack>
      </Flex>
    </Box>
  );
};

export default Header;
