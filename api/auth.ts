import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { create } from "./_lib/oauth2";
import dotenv from "dotenv";

dotenv.config();

export const randomString = () => crypto.randomBytes(4).toString(`hex`);

export default (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const host = req.headers.host;
  if (!host) {
    res.status(400).send('Host header is missing');
    return;
  }

  const oauth2 = create();

  try {
    const url = oauth2.authorizeURL({
      // Vercel'in otomatik HTTPS sağladığını varsayıyoruz, gerekirse protokol kontrolü eklenebilir.
      redirect_uri: `https://${host}/api/callback`,
      scope: `repo,user`, // İstenilen GitHub izinleri
      state: randomString(),
    });

    // VercelResponse üzerinde redirect metodu bulunur
    res.redirect(301, url);
  } catch (error) {
    console.error("Error creating authorization URL:", error);
    res.status(500).send("Internal Server Error");
  }
};
