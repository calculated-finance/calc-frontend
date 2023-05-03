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
  Tooltip,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useField } from 'formik';
import { useDcaInFormPostPurchase } from '@hooks/useDcaInForm';
import { FormNames } from '@hooks/useFormStore';
import { useCosmWasmClient } from '@hooks/useCosmWasmClient';
import useQueryWithNotification from '@hooks/useQueryWithNotification';
import { getDenomName } from '@utils/getDenomInfo';
import { getMarsAddress } from '@helpers/chains';
import Spinner from './Spinner';
import DenomIcon from './DenomIcon';

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

function MarsOption({ resultingDenom, ...props }: UseRadioProps & FlexProps & { resultingDenom: string }) {
  const { getInputProps, getRadioProps, htmlProps, getLabelProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Tooltip label={props.isDisabled ? `Mars is not yet available for ${getDenomName(resultingDenom)}` : ''}>
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
                  <DenomIcon denomName={resultingDenom} />
                </Box>
              </GridItem>
              <GridItem colSpan={5}>
                <Text fontSize="sm">Loan {getDenomName(resultingDenom)} on Mars</Text>
              </GridItem>
              <GridItem colSpan={2} textAlign="right">
                <Text>~{0.1 * 100}%</Text>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
}

function useMars(resultingDenom: string | undefined) {
  const client = useCosmWasmClient((state) => state.client);

  return useQueryWithNotification<any>(
    ['mars-check', client, resultingDenom],
    async () => {
      if (!client) {
        throw new Error('No client');
      }
      const result = await client.queryContractSmart(getMarsAddress(), {
        markets: { limit: 100 },
      });
      return result;
    },
    {
      enabled: !!client && !!resultingDenom,
    },
  );
}

export default function GenerateYield({ formName }: { formName: FormNames }) {
  const [field, meta, helpers] = useField({ name: 'yieldOption' });

  const { context } = useDcaInFormPostPurchase(formName);

  const { resultingDenom } = context || {};

  const { data, isLoading } = useMars(context?.resultingDenom);

  const marsEnabled = data?.find((market: any) => market.denom === resultingDenom);

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
      ) : (
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
            <MarsOption {...marsRadio} resultingDenom={resultingDenom!} isDisabled={!marsEnabled} />
          </Stack>
        </>
      )}
      <FormErrorMessage>{meta.touched && meta.error}</FormErrorMessage>
    </FormControl>
  );
}
