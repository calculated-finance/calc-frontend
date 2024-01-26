import { useDisclosure } from '@chakra-ui/react';
import { useCookieState } from 'ahooks';
import { useEffect } from 'react';
import { useWallet } from '@hooks/useWallet';
import { TermsModal } from '@components/TermsModal';
import dayjs from 'dayjs';
import usePageLoad from '@hooks/usePageLoad';

export function AgreementAcceptanceDetector() {
  const { connected } = useWallet();
  const { isPageLoading } = usePageLoad();

  const oneYearFromNow = dayjs().add(1, 'year').toDate();

  const [acceptedAgreementState, setAcceptedAgreementState] = useCookieState('acceptedAgreement', {
    expires: oneYearFromNow,
  });

  const agreementPreviouslyAccepted = acceptedAgreementState === 'true';

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (!agreementPreviouslyAccepted && connected && !isPageLoading) {
      onOpen();
    }
  }, [agreementPreviouslyAccepted, onOpen, connected, isPageLoading]);

  const onSubmit = () => setAcceptedAgreementState('true');

  return <TermsModal isOpen={isOpen} onClose={onClose} showCheckbox onSubmit={onSubmit} />;
}
