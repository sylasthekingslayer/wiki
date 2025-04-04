import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthorizationCode } from "simple-oauth2";
import { config, Provider } from "../lib/config";

// Define a type for the content object to handle both success and error cases
type RenderBodyContent = { provider: string } & ({ token: string } | { error: string });

function renderBody(
  status: string,
  content: RenderBodyContent
) {
  return `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:${content.provider}:${status}:${JSON.stringify(
    content
  )}',
          message.origin
        );

        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);

      window.opener.postMessage("authorizing:${content.provider}", "*");
    </script>
  `;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host; // Use x-forwarded-host for Vercel
  const proto = req.headers['x-forwarded-proto'] || 'https'; // Use x-forwarded-proto for Vercel
  const url = new URL(req.url!, `${proto}://${host}`); // Construct URL correctly
  const code = url.searchParams.get("code");
  const provider = url.searchParams.get("provider") as Provider;

  // Ensure provider is valid before proceeding
  if (!provider || !config(provider)) {
    return res.status(400).send('Invalid provider specified.');
  }

  try {
    if (!code) throw new Error(`Missing authorization code from ${provider}`);

    const client = new AuthorizationCode(config(provider));
    const tokenParams = {
      code,
      redirect_uri: `${proto}://${host}/callback?provider=${provider}`, // Use proto and host
      scope: '', // Scope might be needed depending on provider/library version
    };

    const accessToken = await client.getToken(tokenParams);
    const token = accessToken.token["access_token"] as string;

    const responseBody = renderBody("success", { token, provider });

    res.status(200).setHeader('Content-Type', 'text/html').send(responseBody);
  } catch (e: any) { // Catch specific error type if possible
    console.error("OAuth Callback Error:", e); // Log the error for debugging
    // Pass provider along with the error message
    const errorContent = { provider, error: e.message || 'Unknown error' };
    const responseBody = renderBody("error", errorContent);
    res.status(200).setHeader('Content-Type', 'text/html').send(responseBody); // Send 200 for the script to run
  }
};
