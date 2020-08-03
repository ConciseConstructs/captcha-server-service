import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'
import { AWS } from 'aws-sdk'

export interface IVerifyRequest {
  siteName:string
}

export function handler(incomingRequest:IVerifyRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IVerifyRequest
    protected response:IResponse
    private params:any
    private systemsManager:AWS.SSM


    constructor(incomingRequest:IVerifyRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }



        protected hookConstructorPre() {
          this.requiredInputs = ["siteName"]
        }




        protected async allConditionsAreMet():Promise<boolean> {
          return new Promise((resolve, reject)=> {
            this.systemsManager = new AWS.SSM()
            if (this.systemsManager) resolve(true)
            else reject(false)
          })
        }












    protected performActions() {
      this.makeParams()
      this.getSiteRecaptchaSecretKey()
    }




        private makeParams() {
          this.params = {
            Name: `${ this.request.siteName }-${ process.env.stage }-recaptcha-secretKey`,
            WithDecryption: true
          }
        }




        private getSiteRecaptchaSecretKey() {
          this.systemsManager.getParameter(this.params).promise()
            .then(result => this.onGetParameterSuccess(result))
            .catch(error => this.onGetParameterFailure(error))
        }




            private onGetParameterFailure(error) {
              this.hasFailed(error)
            }




            private onGetParameterSuccess(result) {
              if (!result) this.onGetParameterFailure(result)
              else this.hasSucceeded(result)
            }



  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
