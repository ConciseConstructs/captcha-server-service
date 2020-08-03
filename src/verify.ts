import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IResponse } from '../lib/classes/lambdahandler/Response.class'
import { Context, Callback } from 'aws-lambda'
const Axios = require("axios");

export interface IVerifyRequest {
  siteName:string
  captchaSubmission:string
}

export function handler(incomingRequest:IVerifyRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {
    protected request:IVerifyRequest
    protected response:IResponse
    private secretKey:string


    constructor(incomingRequest:IVerifyRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }



        protected hookConstructorPre() {
          this.requiredInputs = ["siteName"]
          this.needsToExecuteLambdas = true
        }












    protected async performActions() {
      await this.getSiteSecretKey()
      this.verifyUserSubmission()
    }




        private getSiteSecretKey():Promise<any> {
          let functionName = `${ process.env.saasName }-${ process.env.stage }-secretKey-get`
          return this.lambda.invoke({
            FunctionName: functionName,
            Payload: JSON.stringify({ siteName: this.request.siteName })
          }).promise()
            .then(result => this.onGetSiteSecretKeySuccess(result))
            .catch(error => this.onGetSiteSecretKeyFailure(error))
        }




            private onGetSiteSecretKeyFailure(error) {
              this.hasFailed(error)
            }




            private onGetSiteSecretKeySuccess(result) {
              this.extractValue(result)
            }




                private extractValue(result) {
                  try {
                    let payload = JSON.parse(result.Payload);
                    let body = JSON.parse(payload.body);
                    this.secretKey = body.details.Parameter.Value
                  }
                  catch (error) {
                    console.log('Error:', error);
                  }
                }




      private verifyUserSubmission() {
        let url = `https://www.google.com/recaptcha/api/siteverify?secret=${ this.secretKey }&response=${ this.request.captchaSubmission }`;
        Axios.default.get(url)
          .then(result => this.hasSucceeded(result.data))
          .catch(error => this.hasFailed(error))
      }

  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
