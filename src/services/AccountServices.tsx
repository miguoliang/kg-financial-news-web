import { Subscription } from "models";
import AxiosFetch from "./AxiosFetch";
import { createQuery } from "react-query-kit";

type PostAccountChangePasswordRequestBody = {
  previousPassword: string;
  proposedPassword: string;
}

export const usePostAccountChangePassword = createQuery<any, PostAccountChangePasswordRequestBody>({
  primaryKey: "post.account.change-password",
  queryFn: ({ queryKey: [, data] }) => AxiosFetch({
    url: "/account/change-password",
    method: "post",
    data,
  }),
});

export const useGetAccountSubscriptions = createQuery({
  primaryKey: "get.account.subscriptions",
  queryFn: () => AxiosFetch<Subscription[]>({
    url: `/account/subscriptions`,
    method: "get",
  }).then(resp => resp.data),
});