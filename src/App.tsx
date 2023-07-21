import { BrowserRouter } from "react-router-dom";
import Layout from "components/layout";
import mockServer from "mock";
import appConfig from "configs/app.config";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "configs/chakra.config";

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (appConfig.runtime !== "production" && appConfig.enableMock) {
  console.log("mock server on, environment:", appConfig.runtime);
  mockServer({ environment: appConfig.runtime });
}

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ChakraBaseProvider>
  );
}

export default App;
