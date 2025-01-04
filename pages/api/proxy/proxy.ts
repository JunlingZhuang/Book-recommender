import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { url } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing or invalid URL parameter" });
    return;
  }

  //  decode the url
  url = decodeURIComponent(url);

  try {
    // ensure the url is encoded
    const encodedUrl = encodeURI(url);
    const bookResponse = await fetch(encodedUrl, {
      headers: {
        // set the headers if needed
      },
    });

    // check the content type
    const contentType = bookResponse.headers.get("Content-Type") || "";

    const imageBuffer = await bookResponse.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch data" });
  }
}
