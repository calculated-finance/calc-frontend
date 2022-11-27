import { InputGroup, InputLeftElement, InputRightElement, Input, InputProps } from '@chakra-ui/react';
import getDenomInfo from '@utils/getDenomInfo';
import DenomIcon from '@components/DenomIcon';

export function DenomInput({ denom, ...field }: { denom: string } & InputProps) {
  const { name } = getDenomInfo(denom);
  return (
    <InputGroup>
      <InputLeftElement>
        <DenomIcon denomName={denom} />
      </InputLeftElement>
      <Input type="number" placeholder="Enter amount" {...field} />
      <InputRightElement textStyle="body-xs" w="min-content" p={3}>
        {name}
      </InputRightElement>
    </InputGroup>
  );
}
