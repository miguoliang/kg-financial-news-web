import ApiService from "./ApiService";
import { Subscription } from "models";

export async function apiPostChangePassword(
  previousPassword: string,
  proposedPassword: string,
) {
  return ApiService.fetchData({
    url: "/account/change-password",
    method: "post",
    data: {
      previousPassword,
      proposedPassword,
    },
  });
}

export async function apiGetSubscriptionList() {
  return ApiService.fetchData<Subscription[]>({
    url: "/account/subscriptions",
    method: "get",
  });
}
