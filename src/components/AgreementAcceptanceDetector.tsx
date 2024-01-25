import { useDisclosure } from '@chakra-ui/react';
import { useCookieState } from 'ahooks';
import { useEffect } from 'react';
import { TermsModal } from './TermsModal';
import { useWallet } from '@hooks/useWallet';
import useDenoms from '@hooks/useDenoms';

export function AgreementAcceptanceDetector() {
  const { connected } = useWallet();
  const { isSuccess } = useDenoms();

  //  create date one year from now
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const [acceptedAgreementState, setAcceptedAgreementState] = useCookieState('acceptedAgreement', {
    expires: oneYearFromNow,
  });

  const agreementPreviouslyAccepted = acceptedAgreementState === 'true';

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (!agreementPreviouslyAccepted && connected && isSuccess) {
      onOpen();
    }
  }, [agreementPreviouslyAccepted, onOpen, connected, isSuccess]);

  const onSubmit = () => setAcceptedAgreementState('true');

  return <TermsModal isOpen={isOpen} onClose={onClose} showCheckbox onSubmit={onSubmit} />;
}
