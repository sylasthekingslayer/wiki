import type { VercelRequest, VercelResponse } from "@vercel/node";
import { create, renderBody } from "./_lib/oauth2";
import dotenv from "dotenv";

dotenv.config();

export default async (req: VercelRequest, res: VercelResponse) => {
  // Vercel genellikle CORS'u edge seviyesinde halleder.
  // Helmet middleware'i serverless ortamda genellikle gereksizdir.

  // Sadece GET isteklerini işle
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const code = req.query.code;
  const host = req.headers.host;

  if (typeof code !== 'string') {
    res.status(400).send(renderBody("error", new Error("Authorization code is missing or invalid")));
    return;
  }

  if (!host) {
    res.status(400).send(renderBody("error", new Error("Host header is missing")));
    return;
  }

  const oauth2 = create();

  try {
    const accessToken = await oauth2.getToken({
      code,
      // Vercel'in otomatik HTTPS sağladığını varsayıyoruz
      redirect_uri: `https://${host}/api/callback`,
    });

    // AccessToken nesnesinden token değerini al
    const tokenValue = accessToken.token.access_token;

    if (typeof tokenValue !== 'string') {
      throw new Error("Access token received is not a string.");
    }

    res.status(200).send(
      renderBody("success", {
        token: tokenValue,
        provider: "github",
      })
    );
  } catch (error) {
    console.error("Error getting token:", error);
    // Hata durumunda da renderBody kullanılıyor, hata nesnesini gönderelim
    // Hata nesnesinin yapısına göre mesajı ayarlamak gerekebilir
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send(renderBody("error", { message: `Token exchange failed: ${errorMessage}` }));
  }
};
