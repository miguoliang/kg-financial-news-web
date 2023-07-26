import axios from "axios";
import appConfig from "configs/app.config";
import { useAuth } from "hooks/useAuth";
import { toast } from "hooks/useToast";

const unauthorizedCode = [401];

const AxiosFetch = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefix,
});

AxiosFetch.interceptors.request.use(
  async (config) => {
    if (appConfig.runtime !== "production" && appConfig.enableMock) {
      return config;
    }

    const { userManager } = useAuth.getState();
    const user = await userManager.getUser();
    if (!user || user.expired) {
      toastAndRedirectToLogin();
      return Promise.reject();
    }
    config.headers["Authorization"] = `Bearer ${user.access_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

AxiosFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && unauthorizedCode.includes(response.status)) {
      toastAndRedirectToLogin();
    } else {
      toast({
        status: "error",
        title: error.message,
      });
    }
    return Promise.reject(error);
  },
);

const toastAndRedirectToLogin = () => {
  const { userManager } = useAuth.getState();
  toast({
    status: "error",
    title: "Please login to continue",
    onCloseComplete: async () => {
      await userManager.signinRedirect();
    },
  });
};

export default AxiosFetch;
