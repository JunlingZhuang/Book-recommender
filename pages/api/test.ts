import type { NextApiRequest, NextApiResponse } from "next";
import weaviate from "weaviate-client";
import { NearTextType } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  console.log("Received request", req.body);
  try {
    const bookPreference = req.body.query;
    const userInterests = req.body.userInterests;
    console.log(
      "bookPreference:",
      bookPreference,
      "userInterests:",
      userInterests
    );
    const WEAVIATE_CLUSTER_URL = process.env.WEAVIATE_CLUSTER_URL;
    const WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY;

    if (!WEAVIATE_CLUSTER_URL || !WEAVIATE_API_KEY) {
      res
        .status(500)
        .json({ error: "Weaviate cluster URL or API key is missing" });
      return;
    }

    let headers: { [key: string]: string } = {};
    if (process.env.COHERE_API_KEY) {
      headers["X-Cohere-Api-Key"] = process.env.COHERE_API_KEY;
    }

    const client = await weaviate.connectToWeaviateCloud(WEAVIATE_CLUSTER_URL, {
      authCredentials: new weaviate.ApiKey(WEAVIATE_API_KEY),
      headers: {
        "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY || "",
      },
    });

    let nearText: NearTextType = {
      concepts: bookPreference,
    };

    let generatePrompt =
      "Briefly describe why this book might be interesting to someone who has interests or hobbies in " +
      userInterests +
      ". The book's title is {title}, with a description: {description}, and is in the genre: {categories}. Don't make up anything that wasn't given in this prompt and don't ask how you can help.";

    const myCollection = client.collections.get("Book");

    let result = await myCollection.query.nearText(nearText.concepts, {
      limit: 2,
      returnProperties: [
        "title",
        "isbn10",
        "isbn13",
        "categories",
        "thumbnail",
        "description",
        "num_pages",
        "average_rating",
        "published_year",
        "authors",
      ],
      returnMetadata: ["distance"],
    });

    const books = result.objects.map((item) => ({
      properties: item.properties,
      distance: item.metadata?.distance,
    }));

    console.log("Books found:", books);
    res.status(200).json({ books });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
