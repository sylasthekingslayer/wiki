import { VercelRequest, VercelResponse } from "@vercel/node";
import { create, renderBody } from "./_lib/oauth2";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { IncomingMessage, ServerResponse, createServer } from "http";

dotenv.config();

const app: express.Application = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
      },
    },
  })
);


app.use(cors({
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  origin: '*',
}));

app.get('/api/callback', async (req: express.Request, res: express.Response) => {
  const code = req.query.code as string;
  const { host } = req.headers;

  const oauth2 = create();

  try {
    const accessToken = await oauth2.getToken({
      code,
      redirect_uri: `https://${host}/api/callback`
    });
    // The result from getToken is an AccessToken object which contains the token details.
    // Access the access_token directly from the token property.
    const tokenValue = accessToken.token.access_token;

    res.status(200).send(
      renderBody("success", {
        token: tokenValue as string, // Cast to string
        provider: "github"
      })
    );
  } catch (e) {
    res.status(200).send(renderBody("error", e));
  }
});

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  app(req as any, res as any);
});

export default (req: VercelRequest, res: VercelResponse) => {
  server.emit("request", req, res);
};
