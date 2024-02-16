import { AccountLoginOutput, AccountLoginSchema } from "../../model/Account";
import { ApiResponse } from "../../model/schema/base_schema";

export function transfromToServiceLoginAccountOutput(
    response: ApiResponse<AccountLoginSchema>
): AccountLoginOutput {
  const { outputSchema } = response;
  return {
    token: response.outputSchema.token!
  }

  // const result = {
  //     email: response.email,
  //     password: response.password
  // }
}