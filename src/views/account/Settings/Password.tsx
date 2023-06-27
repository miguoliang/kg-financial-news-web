import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { apiPostChangePassword } from "../../../services/AccountServices";

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string().required("Required"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Passwords must match",
  ),
});

const Password = () => {
  return (
    <>
      <Heading as={"h4"} size={"md"} fontWeight={"semibold"}>
        Password
      </Heading>
      <Text color={"gray.500"}>
        Enter your current & new password to reset your password
      </Text>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        validationSchema={ChangePasswordSchema}
        onSubmit={async (values) => {
          await apiPostChangePassword(
            values.currentPassword,
            values.newPassword,
          );
        }}
      >
        {({ handleSubmit, handleReset, errors, touched }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <FormControl
              paddingY={8}
              isInvalid={!!errors.currentPassword && touched.currentPassword}
            >
              <SimpleGrid columns={3} alignItems={"center"} gap={3}>
                <FormLabel htmlFor={"currentPassword"}>
                  Current Password
                </FormLabel>
                <GridItem colSpan={2} position={"relative"}>
                  <Field
                    as={Input}
                    name={"currentPassword"}
                    id={"currentPassword"}
                    type={"password"}
                    maxWidth={"700px"}
                  />
                  <FormErrorMessage>
                    {errors.currentPassword ?? ""}
                  </FormErrorMessage>
                </GridItem>
              </SimpleGrid>
            </FormControl>
            <Divider />
            <FormControl
              paddingY={8}
              isInvalid={!!errors.newPassword && touched.newPassword}
            >
              <SimpleGrid columns={3} alignItems={"center"} gap={3}>
                <FormLabel htmlFor={"newPassword"}>New Password</FormLabel>
                <GridItem colSpan={2} position={"relative"}>
                  <Field
                    as={Input}
                    name={"newPassword"}
                    id={"newPassword"}
                    type={"password"}
                    maxWidth={"700px"}
                  />
                  <FormErrorMessage>
                    {errors.newPassword ?? ""}
                  </FormErrorMessage>
                </GridItem>
              </SimpleGrid>
            </FormControl>
            <Divider />
            <FormControl
              paddingY={8}
              isInvalid={
                !!errors.confirmNewPassword && touched.confirmNewPassword
              }
            >
              <SimpleGrid columns={3} alignItems={"center"} gap={3}>
                <FormLabel htmlFor={"confirmNewPassword"}>
                  Confirm Password
                </FormLabel>
                <GridItem colSpan={2} position={"relative"}>
                  <Field
                    as={Input}
                    name={"confirmNewPassword"}
                    id={"confirmNewPassword"}
                    type={"password"}
                    maxWidth={"700px"}
                  />
                  <FormErrorMessage>
                    {errors.confirmNewPassword ?? ""}
                  </FormErrorMessage>
                </GridItem>
              </SimpleGrid>
            </FormControl>
            <Divider />
            <HStack mt={4}>
              <Spacer />
              <Button type={"reset"} variant={"outline"}>
                Reset
              </Button>
              <Button type={"submit"} colorScheme={"blue"}>
                Save Changes
              </Button>
            </HStack>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Password;
