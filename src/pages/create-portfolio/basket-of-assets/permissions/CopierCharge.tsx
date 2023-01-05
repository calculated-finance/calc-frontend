import {
  Box,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  SimpleGrid,
  Spacer,
  Tooltip,
  useRadioGroup,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { FormNames } from '@hooks/useDcaInForm';
import useFormSchema from 'src/hooks/useFormSchema';

import { basketOfAssetsSteps } from '@models/DcaInFormData';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import YesNoValues from '@models/YesNoValues';
import RadioCard from '../../../../components/RadioCard';
import Radio from '../../../../components/Radio';
import AutoStakeValues from '../../../../models/AutoStakeValues';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

function FeeField({ name, label }: { name: string; label: string }) {
  const [{ onChange, ...field }, meta, helpers] = useField({
    name,
  });
  const handleChange = (values: NumberFormatValues) => {
    helpers.setValue(values.value);
  };
  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <Flex align="center" gap={2}>
        <FormHelperText fontSize="xs">{label}</FormHelperText>
        <Tooltip label="More info here">
          <Icon size="xs" color="blue.200" as={QuestionOutlineIcon} />
        </Tooltip>
      </Flex>
      <NumericFormat
        valueIsNumericString
        allowNegative={false}
        decimalScale={0}
        suffix="%"
        textAlign="left"
        customInput={Input}
        onValueChange={handleChange}
        placeholder="Enter %"
        variant="filled"
        {...field}
      />
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}

export const autoStakeData: { value: AutoStakeValues; label: string }[] = [
  {
    value: AutoStakeValues.Yes,
    label: 'Yes',
  },
  {
    value: AutoStakeValues.No,
    label: 'No',
  },
];

export function CopierCharge() {
  const [field, , helpers] = useField({ name: 'copierCharge' });

  const {
    state: [state],
  } = useFormSchema(FormNames.BasketOfAssets, basketOfAssetsSteps, 3);

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  return (
    <Box>
      <FormControl>
        <FormLabel>Charge fees for copiers of this basket?</FormLabel>
        <HStack>
          <Radio {...getRootProps}>
            {autoStakeData.map((option) => {
              const radio = getRadioProps({ value: option.value });
              return (
                <RadioCard key={option.label} {...radio}>
                  {option.label}
                </RadioCard>
              );
            })}
          </Radio>
        </HStack>
      </FormControl>
      <Collapse in={field.value === YesNoValues.Yes}>
        <Box m="px">
          <Grid templateColumns="repeat(6, 1fr)" gap={2}>
            <GridItem colSpan={2}>
              <FeeField name="managementFee" label="Management fee" />
            </GridItem>
            <GridItem colSpan={2}>
              <FeeField name="openingFee" label="Opening fee" />
            </GridItem>
            <GridItem colSpan={2}>
              <FeeField name="closingFee" label="Closing fee" />
            </GridItem>
            <GridItem colSpan={3}>
              <FeeField name="hurdleRate" label="Hurdle rate" />
            </GridItem>
            <GridItem colSpan={3}>
              <FeeField name="performanceFee" label="Performance fee" />
            </GridItem>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}
