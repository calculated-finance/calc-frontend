import { Flex, Text, Box, Tooltip } from '@chakra-ui/react';
import useSteps from '@hooks/useSteps';
import { StepConfig } from './steps';

function StepperSeparator({ past }: { past: boolean }) {
  return <Flex h={1} my="auto" borderTopWidth={1} w={3} borderColor={past ? 'green.200' : 'abyss.200'} />;
}

export default function Stepper({ steps }: { steps: StepConfig[] }) {
  const { currentStepIndex, goToStep } = useSteps(steps);

  return (
    <Flex flexDirection="row" alignItems="center">
      {steps.map((step, index, array) => {
        const past = index < currentStepIndex;
        const active = index === currentStepIndex;

        const handleClick = () => {
          if (index !== currentStepIndex && past) {
            goToStep(index);
          }
        };

        const cursor = past ? 'pointer' : 'default';
        return (
          <Flex>
            <Tooltip label={step.title}>
              <Box cursor={cursor} key={step.href} onClick={handleClick}>
                <Flex
                  w={7}
                  h={7}
                  borderRadius="full"
                  bg="abyss.200"
                  align="center"
                  justify="center"
                  borderColor={past ? 'green.200' : 'transparent'}
                  borderWidth={1}
                  boxSizing="content-box"
                >
                  <Flex
                    borderRadius="full"
                    w={5}
                    h={5}
                    align="center"
                    justify="center"
                    borderColor={active ? 'green.200' : 'abyss.200'}
                    borderWidth={1}
                  >
                    <Flex
                      borderWidth={1}
                      borderRadius="full"
                      w={4}
                      h={4}
                      bg={past || active ? 'green.200' : 'blue.200'}
                      align="center"
                      justify="center"
                    >
                      <Text fontSize="xs" color="navy">
                        {index + 1}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Tooltip>
            {index !== array.length - 1 && <StepperSeparator past={past} />}
          </Flex>
        );
      })}
    </Flex>
  );
}
