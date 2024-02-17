import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Stack,
  Text,
  useRadioGroup,
  Center,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { DenomInfo } from '@utils/DenomInfo';
import Spinner from '../Spinner';
import DenomIcon from '../DenomIcon';
import { useMarket } from '@hooks/useMarket';
import { YieldOption } from './YieldOption';

export default function GenerateYield({ resultingDenom }: { resultingDenom: DenomInfo }) {
  const [field, meta, helpers] = useField({ name: 'yieldOption' });

  const { data: marketData, isLoading } = useMarket(resultingDenom);

  const marsEnabled = marketData && marketData.deposit_enabled;

  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: marsEnabled ? field.value : null,
    onChange: helpers.setValue,
  });

  const marsRadio = getRadioProps({ value: 'mars' });

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Strategy</FormLabel>
      <FormHelperText pb={4}>CALC can deploy post swap capital on your behalf.</FormHelperText>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : marsEnabled ? (
        <>
          <Grid textStyle="body-xs" templateColumns="repeat(8, 1fr)" gap={4} mb={4} textDecoration="underline" px={3}>
            <GridItem colSpan={1}>
              <Text>Asset</Text>
            </GridItem>
            <GridItem colSpan={5}>
              <Text flexGrow={1}>Action</Text>
            </GridItem>
            <GridItem colSpan={2} textAlign="right">
              <Text>Expected APR</Text>
            </GridItem>
          </Grid>
          <Stack {...getRootProps} maxH={200} overflow="auto">
            <YieldOption
              {...marsRadio}
              description={`Loan ${resultingDenom.name} on Mars`}
              icon={<DenomIcon denomInfo={resultingDenom} />}
              apr={Number(marketData.liquidity_rate)}
            />
          </Stack>
        </>
      ) : (
        <Center>No yield strategies available for {resultingDenom.name} yet.</Center>
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
