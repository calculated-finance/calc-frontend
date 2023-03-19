import { getFlowLayout } from '@components/Layout';
import { dcaPlusInSteps } from 'src/formConfig/dcaPlusIn';
import { SuccessStrategyModal } from '@components/SuccessStrategyModal';
import React from 'react';
import { AbsoluteCenter } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import Confetti from 'src/animations/confetti.json';

function Success() {
  return (
    <>
      <SuccessStrategyModal stepConfig={dcaPlusInSteps} />; ;
    </>
  );
}
Success.getLayout = getFlowLayout;

export default Success;
