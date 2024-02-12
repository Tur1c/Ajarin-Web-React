import { AccountLoginSchema } from "../../model/Account";
import { ApiResponse } from "../../model/schema/base_schema";

export function transfromToServiceLoginAccountOutput(
    response: ApiResponse<AccountLoginSchema>
) {
    const {errorSchema} = response;
    
    // const result = {
    //     email: response.email,
    //     password: response.password
    // }
}