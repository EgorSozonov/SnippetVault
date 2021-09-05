import { Dispatch } from "redux"


export const SVEffect = {
    tryAuthenticate: (request: string) => (dispatch: Dispatch, api: any): Promise<void> => {
        return api.get(request)
                  .then((res: any) => {

                  })
                  .catch((err: any) => {
                      console.log(err)
                  })
    }
}