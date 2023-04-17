import {
  Box,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Stack,
  Text,
  UseRadioProps,
  useRadio,
  useRadioGroup,
  Center,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import { FormNames } from '@hooks/useFormStore';
import { Pool } from 'osmojs/types/codegen/osmosis/gamm/pool-models/balancer/balancerPool';
import { useOsmosisPools } from '../hooks/useOsmosisPools';
import { findAsset, useAssetList } from '../hooks/useAssetList';
import Spinner from './Spinner';
import { PoolDescription } from './PoolDescription';
import { PoolDenomIcons } from './PoolDenomIcons';

function YieldOption(props: UseRadioProps & FlexProps & { pool: Pool }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);
  const { pool } = props;

  const input = getInputProps();
  const checkbox = getRadioProps();

  const { data: assetData } = useAssetList();

  const poolInfo = {
    assetIn: findAsset(assetData.assets, pool.poolAssets[0].token?.denom),
    assetOut: findAsset(assetData.assets, pool.poolAssets[1].token?.denom),
  };

  const { assetIn, assetOut } = poolInfo;

  return (
    <Box as="label" {...htmlProps}>
      <input {...input} />
      <Box
        {...checkbox}
        borderWidth={1}
        py={4}
        px={6}
        borderRadius="2xl"
        w="full"
        _hover={{ borderColor: 'grey', cursor: 'pointer' }}
        _checked={{
          borderColor: 'brand.200',
        }}
        _focusVisible={{
          boxShadow: 'outline',
        }}
      >
        <Box {...getLabelProps()}>
          <Flex justify="space-between" align="center" gap={4}>
            <PoolDenomIcons pool={pool} />
            <Text flexGrow={1} fontSize="sm">
              <PoolDescription pool={pool} />
            </Text>
            <Text>{0.1 * 100}%</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default function GenerateYield({ formName }: { formName: FormNames }) {
  const [field, meta, helpers] = useField({ name: 'yieldOption' });
  const { getRootProps, getRadioProps } = useRadioGroup({
    ...field,
    value: field.value,
    onChange: helpers.setValue,
  });

  const { context } = useDcaInFormPostPurchase(formName);

  const { data, isLoading } = useOsmosisPools();

  return (
    <FormControl isInvalid={Boolean(meta.touched && meta.error)}>
      <FormLabel>Choose Strategy</FormLabel>
      <FormHelperText pb={4}>CALC uses AuthZ to deploy the post swap capital on your behalf.</FormHelperText>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Stack {...getRootProps} maxH={200} overflow="auto">
          {data?.map((pool: Pool) => {
            const radio = getRadioProps({ value: pool.id.toString() });
            return <YieldOption key={pool.id.toString()} {...radio} pool={pool} />;
          })}
        </Stack>
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
