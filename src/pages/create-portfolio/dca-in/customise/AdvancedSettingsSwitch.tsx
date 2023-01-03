import { Flex, Switch, Text } from '@chakra-ui/react';
import { useField } from 'formik';

export default function AdvancedSettingsSwitch() {
  const [field] = useField('advancedSettings');

  return (
    <Flex justify="end">
      <Text mr={2} textStyle="body-xs">
        Advanced Settings
      </Text>
      <Switch size="sm" colorScheme="brand" isChecked={field.value} onChange={field.onChange} name={field.name} />
    </Flex>
  );
}
