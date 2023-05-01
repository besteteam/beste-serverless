import {
  handlers,
  startServerAndCreateLambdaHandler,
} from "@as-integrations/aws-lambda";
import server from "./server";

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler()
  // {
  //   context: async ({ context, event }) => {
  //     return Promise.resolve({
  //       context,
  //       event,
  //       function: context.functionName,
  //       headers: event.headers,
  //     });
  //   },
  // }
  //   {
  //     middleware: [
  //       async (event) => {
  //         console.log("###? received event=" + JSON.stringify(event));
  //       },
  //     ],
  //   }
);
