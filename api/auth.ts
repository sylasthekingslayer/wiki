import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthorizationCode } from "simple-oauth2";
import { randomBytes } from "crypto";
import { config, Provider } from "../lib/config";
import { scopes } from "../lib/scopes";

export const randomString = () => randomBytes(4).toString("hex");

export default async (req: VercelRequest, res: VercelResponse) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host; // Use x-forwarded-host for Vercel
  const proto = req.headers['x-forwarded-proto'] || 'https'; // Use x-forwarded-proto for Vercel
  const url = new URL(req.url!, `${proto}://${host}`); // Construct URL correctly
  const provider = url.searchParams.get("provider") as Provider;

  const client = new AuthorizationCode(config(provider));

  const authorizationUri = client.authorizeURL({
    redirect_uri: `${proto}://${host}/callback?provider=${provider}`, // Use proto and host
    scope: scopes[provider] || '', // Ensure scope is a string
    state: randomString(),
  });

  res.redirect(301, authorizationUri); // Use VercelResponse.redirect
};
