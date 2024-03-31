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

  // 解码收到的URL
  url = decodeURIComponent(url);

  try {
    // 确保使用编码后的URL进行请求
    const encodedUrl = encodeURI(url);
    const bookResponse = await fetch(encodedUrl, {
      headers: {
        // 如果需要的话，这里可以设置额外的头部信息
      },
    });

    // 检查响应的内容类型
    const contentType = bookResponse.headers.get("Content-Type") || "";

    const imageBuffer = await bookResponse.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch data" });
  }
}
