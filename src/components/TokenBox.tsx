import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  IconButton,
  Button,
  useOutsideClick,
  Text,
  HStack,
  Stack,
  Box,
  Center,
  Heading,
} from '@chakra-ui/react';
import { KeyIcon, KeypairIcon } from '@fusion-icons/react/interface';
import Icon from './Icon';

function TokenBox() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = React.createRef<HTMLElement>();
  useOutsideClick({
    ref,
    handler: onClose,
  });

  return (
    <Popover placement="bottom-start" closeOnBlur={false} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          leftIcon={<Icon as={KeyIcon} stroke={isOpen ? 'brand.200' : 'grey.200'} />}
          rightIcon={<Icon as={KeypairIcon} stroke={isOpen ? 'brand.200' : 'grey.200'} />}
          variant="outline"
          colorScheme={isOpen ? 'brand' : 'grey'}
          aria-label="key"
          ml={6}
        />
      </PopoverTrigger>
      <PopoverContent bg="deepHorizon" boxShadow="deepHorizon" p={6} borderWidth={0} w={159}>
        <Stack>
          <Text fontSize="xs" color="white">
            CALC tokens staked:
          </Text>
          <Box position="relative">
            <Center h="full" w="full" zIndex={10} position="absolute" backdropFilter="auto" backdropBlur="2px">
              <Text fontSize="sm">Coming soon</Text>
            </Center>
            <Box>
              <HStack>
                <Icon as={KeyIcon} stroke="white" />
                <Text as="span" fontSize="xs" color="white">
                  1k CALC
                </Text>
              </HStack>
              <HStack>
                <Icon as={KeypairIcon} stroke="white" />
                <Text as="span" fontSize="xs" color="white">
                  10k CALC
                </Text>
              </HStack>
            </Box>
          </Box>
        </Stack>
      </PopoverContent>
    </Popover>
  );
}

export default TokenBox;
