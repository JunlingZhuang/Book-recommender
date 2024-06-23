import type { NextApiRequest, NextApiResponse } from "next";
import weaviate, { WeaviateClient, ApiKey } from "weaviate-ts-client";

import { NearTextType } from "types";
import { CustomHeaders } from "types";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  try {
    // console.log("query is", query);
    const bookPreference = req.body.query;
    console.log("book perfernece", req.body.query);
    const userInterests = req.body.userInterests;
    console.log("userInterests is", userInterests);
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

    const client: WeaviateClient = weaviate.client({
      scheme: "https",
      host: WEAVIATE_CLUSTER_URL.replace("https://", ""),
      apiKey: new ApiKey(WEAVIATE_API_KEY),
      headers: headers, // Type assertion if necessary
    });

    let nearText: NearTextType = {
      concepts: bookPreference,
      distance: 0.6,
    };

    let generatePrompt =
      "Briefly describe why this book might be interesting to someone who has interests or hobbies in " +
      userInterests +
      ". the book's title is {title}, with a description: {description}, and is in the genre: {categories}. Don't make up anything that wasn't given in this prompt and don't ask how you can help.";

    let recDataBuilder = client.graphql
      .get()
      .withClassName("Book")
      .withFields(
        "title isbn10 isbn13 categories thumbnail description num_pages average_rating published_year authors"
      )
      .withNearText(nearText)
      .withLimit(20)
      .withGenerate({
        singlePrompt: generatePrompt,
      });

    const recData = await recDataBuilder.do();
    if (recData.data && recData.data.Get && recData.data.Get.Book) {
      console.log("Number of books:", recData.data.Get.Book.length);
      recData.data.Get.Book.forEach((book, index) => {
        console.log(`Book ${index + 1}:`, book);
      });
    }

    res.status(200).json(recData);
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
