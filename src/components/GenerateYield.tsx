import {
  Box,
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
  Tooltip,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import { getMarsAddress } from '@helpers/chains';
import { useQuery } from '@tanstack/react-query';
import { DenomInfo } from '@utils/DenomInfo';
import Spinner from './Spinner';
import DenomIcon from './DenomIcon';

// from https://github.com/mars-protocol/interface/blob/main/src/types/interfaces/redbank.d.ts
interface InterestRateModel {
  optimal_utilization_rate: string;
  base: string;
  slope_1: string;
  slope_2: string;
}
interface Market {
  denom: string;
  max_loan_to_value: string;
  liquidation_threshold: string;
  liquidation_bonus: string;
  reserve_factor: string;
  interest_rate_model: InterestRateModel;
  borrow_index: string;
  liquidity_index: string;
  borrow_rate: string;
  liquidity_rate: string;
  indexes_last_updated: number;
  collateral_total_scaled: string;
  debt_total_scaled: string;
  deposit_enabled: boolean;
  borrow_enabled: boolean;
  deposit_cap: string;
}

// function YieldOption(props: UseRadioProps & FlexProps & { pool: Pool }) {
//   const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);
//   const { pool } = props;

//   const input = getInputProps();
//   const checkbox = getRadioProps();

//   const { data: assetData } = useAssetList();

//   const poolInfo = {
//     assetIn: findAsset(assetData.assets, pool.poolAssets[0].token?.denom),
//     assetOut: findAsset(assetData.assets, pool.poolAssets[1].token?.denom),
//   };

//   const { assetIn, assetOut } = poolInfo;

//   return (
//     <Box as="label" {...htmlProps}>
//       <input {...input} />
//       <Box
//         {...checkbox}
//         borderWidth={1}
//         py={4}
//         px={6}
//         borderRadius="2xl"
//         w="full"
//         _hover={{ borderColor: 'grey', cursor: 'pointer' }}
//         _checked={{
//           borderColor: 'brand.200',
//         }}
//         _focusVisible={{
//           boxShadow: 'outline',
//         }}
//       >
//         <Box {...getLabelProps()}>
//           <Flex justify="space-between" align="center" gap={4}>
//             <PoolDenomIcons pool={pool} />
//             <Text flexGrow={1} fontSize="sm">
//               <PoolDescription pool={pool} />
//             </Text>
//             <Text>{0.1 * 100}%</Text>
//           </Flex>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

function MarsOption({
  resultingDenom,
  marsData,
  ...props
}: UseRadioProps & FlexProps & { resultingDenom: DenomInfo; marsData: Market | undefined }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Tooltip label={props.isDisabled ? `Mars is not yet available for ${resultingDenom.name}` : ''}>
      <Box as="label" {...htmlProps}>
        <input {...input} />
        <Box
          {...checkbox}
          borderWidth={1}
          py={4}
          px={3}
          borderRadius="2xl"
          w="full"
          _hover={{ borderColor: 'grey', cursor: 'pointer' }}
          _checked={{
            borderColor: 'brand.200',
          }}
          _focusVisible={{
            boxShadow: 'outline',
          }}
          _disabled={{
            opacity: 0.5,
            cursor: 'not-allowed',
          }}
        >
          <Box {...getLabelProps()}>
            <Grid templateColumns="repeat(8, 1fr)">
              <GridItem colSpan={1} verticalAlign="center" textAlign="center">
                <Box mt="px">
                  <DenomIcon denomInfo={resultingDenom} />
                </Box>
              </GridItem>
              <GridItem colSpan={5}>
                <Text fontSize="sm">Loan {resultingDenom.name} on Mars</Text>
              </GridItem>
              <GridItem colSpan={2} textAlign="right">
                <Text>~{Number((Number(marsData?.liquidity_rate) * 100).toFixed(2))}%</Text>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
}

function useMarket(resultingDenom: DenomInfo | undefined) {
  const client = useCosmWasmClient((state) => state.client);

  return useQuery<Market>(
    ['mars-market', client, resultingDenom?.id],
    async () => {
      if (!client) {
        throw new Error('No client');
      }

      if (!resultingDenom) {
        throw new Error('No resulting denom');
      }

      const result = await client.queryContractSmart(getMarsAddress(), {
        market: { denom: resultingDenom.id },
      });

      return result;
    },
    {
      enabled: !!client && !!resultingDenom,
      meta: {
        errorMessage: 'Error fetching Mars data',
      },
    },
  );
}

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
            <MarsOption {...marsRadio} resultingDenom={resultingDenom} marsData={marketData} />
          </Stack>
        </>
      ) : (
        <Center>No yield strategies available for {resultingDenom.name} yet.</Center>
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
