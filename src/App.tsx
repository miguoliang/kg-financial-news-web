import { ChakraBaseProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "components/layout";
import { appConfig, chakraTheme } from "configs";
import { BrowserRouter } from "react-router-dom";

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (appConfig.runtime !== "production" && appConfig.enableMock) {
  import("mock").then(({ worker }) => {
    console.log("mock server on, environment:", appConfig.runtime);
    worker.start();
  });
  const a = 2;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraBaseProvider theme={chakraTheme}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ChakraBaseProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
