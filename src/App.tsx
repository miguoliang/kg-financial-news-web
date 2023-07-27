import { BrowserRouter } from "react-router-dom";
import Layout from "components/layout";
import appConfig from "configs/app";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "configs/chakra";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (appConfig.runtime !== "production" && appConfig.enableMock) {
  import("mock").then(({ default: mockServer }) => {
    console.log("mock server on, environment:", appConfig.runtime);
    mockServer({ environment: appConfig.runtime });
  });
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraBaseProvider theme={theme}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ChakraBaseProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
