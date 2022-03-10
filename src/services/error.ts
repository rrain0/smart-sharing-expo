import {AllUndef, anyObj, empty} from "@u2/utils";


export type ErrorType = {
    code: 401 | 403 // 403 unauthorized while login | 401 forbidden if try to access to resource and can't
        | 'error' | 'errors'
        | 'no-internet' | 'no-server'
        | 'incorrect-data' | 'incorrect-login' | 'incorrect-password'
    data?: any
}

export type ErrorObj = { error: ErrorType }
export type ErrorEmpty = { error: undefined }


export type ErrorOrData<D extends anyObj> = ErrorObj | ErrorEmpty & D