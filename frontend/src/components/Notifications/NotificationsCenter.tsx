import {
  Box,
  VStack,
  HStack,
  Text,
  CloseButton,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { useNotifications } from '../../contexts/NotificationsContext';
import { memo } from 'react';

const iconMap = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiXCircle,
};

const NotificationsCenter = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <Box position="fixed" top="4" right="4" zIndex="1000">
      <VStack spacing={2} align="flex-end">
        {notifications.map((notif) => (
          <Box
            key={notif.id}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            p={3}
            minW="300px"
            maxW="350px"
            borderLeftWidth="4px"
            borderColor={`${notif.type}.400`}
          >
            <HStack justifyContent="space-between">
              <HStack>
                <Icon as={iconMap[notif.type]} color={`${notif.type}.500`} />
                <Text fontSize="sm">{notif.message}</Text>
              </HStack>
              <CloseButton size="sm" onClick={() => removeNotification(notif.id)} />
            </HStack>
            <Badge mt={2} colorScheme="gray">
              {notif.timestamp.toLocaleTimeString()}
            </Badge>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default memo(NotificationsCenter);
