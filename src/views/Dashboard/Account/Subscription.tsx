import {
  Button,
  Card,
  CardBody,
  Circle,
  Heading,
  HStack,
  Spacer,
  Text,
  useBoolean,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiGetSubscriptionList } from "services/AccountServices";
import { Subscription as SubscriptionModel } from "models/subscription";
import Loading from "components/ui/Loading";

const Subscription = () => {
  const [loading, setLoading] = useBoolean();
  const [subscriptionList, setSubscriptionList] = useState<SubscriptionModel[]>(
    [],
  );
  useEffect(() => {
    setLoading.on();
    apiGetSubscriptionList()
      .then((resp) => {
        setSubscriptionList(resp.data);
      })
      .finally(() => {
        setLoading.off();
      });
  }, []);

  return (
    <>
      <Heading as={"h4"} size={"md"} fontWeight={"semibold"}>
        Subscription
      </Heading>
      <Text color={"gray.500"}>
        Manage your subscription and payment settings
      </Text>
      <Loading loading={loading}>
        <VStack spacing={5} alignItems={"start"} marginTop={5}>
          {subscriptionList.map((subscription) => {
            return (
              <SubscriptionItem
                key={subscription.subscriptionId}
                subscription={subscription}
              />
            );
          })}
        </VStack>
      </Loading>
    </>
  );
};

const SubscriptionItem = ({
  subscription,
}: {
  subscription: SubscriptionModel;
}) => {
  return (
    <Card _hover={{ bg: "gray.100" }}>
      <CardBody as={HStack} gap={5} alignItems={"center"}>
        <Circle size="60px" bg="green.500" />
        <VStack alignItems={"start"} gap={0}>
          <Heading
            as={"h6"}
            size={"md"}
            lineHeight={1.5}
            fontWeight={"semibold"}
          >
            {subscription.planName}
          </Heading>
          <Text color={"gray.500"} fontSize={"sm"} lineHeight={2}>
            Next charge on {subscription.endTime}, ${subscription.planAmount}
          </Text>
        </VStack>
        <Spacer />
        <VStack>
          <Button
            variant={"link"}
            lineHeight={2}
            color={"blue.500"}
            _hover={{
              color: "blue.700",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Cancel subscription
          </Button>
          <Button
            variant={"link"}
            lineHeight={2}
            color={"blue.500"}
            _hover={{
              color: "blue.700",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Disable auto-renew
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default Subscription;
