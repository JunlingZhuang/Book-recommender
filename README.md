# Book Recommendations

[![Weaviate](https://img.shields.io/static/v1?label=powered%20by&message=Weaviate%20%E2%9D%A4&color=green&style=flat-square)](https://weaviate.io/)
[![Demo](https://img.shields.io/badge/Check%20out%20the%20demo!-yellow?&style=flat-square&logo=react&logoColor=white)](https://book-recommender-junling.vercel.app/)

This project is a book recommendation service that suggests books based on a user's inputted genre and book titles. It's built upon a database of 7000 books retrieved from Kaggle. Using openn AI as the large language model, vector embeddings were created with the Kaggle dataset to allow for quick vector search to find semantically similar books through natural language input. The frontend is built using Next.js and styled with TailwindCSS.

![Project Screenshot](/BookRecs.gif)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Data Source](#data-source)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

## Features

- Input genre and book titles to get book recommendations
- Vector Search on Weaviate Vector database of 7000 books
- Jupyter Notebook workflow to access and store vector embeddings in Weaviate
- Responsive design, thanks to TailwindCSS

## Configuring Cohere Integration

This project provides book recommendations using a vector database for semantic search. An additional feature is the integration with Cohere through the Weaviate Generative Search module, which provides explainations as to why a user might like a particular book recommendation.

If you would like to enable this feature, you will need to configure the COHERE_API_KEY and NEXT_PUBLIC_COHERE_CONFIGURED environment variables.

Steps

1. Obtain a Cohere API key by signing up on the [Cohere website](https://cohere.com).
2. Once you have your API key, open the .env file in the root directory of the project.
3. Add the following line to the file, replacing 'INSERT_OPEN_API_KEY_HERE' with the API key you obtained from Cohere:

```
COHERE_API_KEY=INSERT_OPENAPI_KEY_HERE
```

4. To enable the Cohere integration, set the NEXT_PUBLIC_COHERE_CONFIGURED environment variable to "1". Add the following line to the .env file:

```
NEXT_PUBLIC_COHERE_CONFIGURED=1
```

5. Save the .env file and restart your development server. The Cohere integration should now be enabled.

Please note that the COHERE_API_KEY should be kept secret and not exposed to the client-side of your application.

## Usage

To use the service, simply type in a genre and several book titles in the provided input fields. The system will then generate several book recommendations based on your inputs.

You can try this at https://book-recommender-junling.vercel.app/

You must set at least on OPENAI_API_KEY environment variable. You can also set up your own Weaviate cluster and create embeddings yourself. If you choose not to do this, BookRecs will use a Read Only API key for an existing Weaviate cluster containing the Kaggle dataset.

## Data Source

The book data used for this project is sourced from the following Kaggle dataset: [7k books with metadata](https://www.kaggle.com/datasets/dylanjcastillo/7k-books-with-metadata). The dataset has been converted to a vector embedding using the sentence-transformer model for improved natural language processing and stored in a Weaviate clustor for fast vector lookups.

## Tech Stack

- NodeJS version 18.12.1 or above
- Next.js
- TailwindCSS
- Python Data Pipeline

## 💰 Large Language Model (LLM) Costs

BookRecs exclusively utilizes OpenAI models. Be advised that the usage costs for these models will be billed to the API access key you provide. Primarily, costs are incurred during data embedding and answer generation processes.
