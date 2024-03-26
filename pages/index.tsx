import { SyntheticEvent, useState, useEffect } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import Modal from "react-modal";
import { Book } from "types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "70%",
    height: "80%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5px",
    backgroundColor: "black",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
};
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [query, setQuery] = useState("");
  const [userInterests, setUserInterests] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedbook] = useState<Book | undefined>(undefined);

  const openModal = (book_title: string) => {
    const bookSelection = recommendedBooks.filter((book: Book) => {
      return book.title === book_title;
    });
    console.log(bookSelection);
    setSelectedbook(bookSelection[0]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getRecommendations = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Check Inputs
    if (query === "") {
      alert("Please let us know what you'd like to learn!");
      return;
    }

    setIsLoading(true);

    await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        userInterests,
      }),
    })
      .then((res) => {
        console.log(res);
        if (res.ok) return res.json();
      })
      .then((recommendations) => {
        console.log(recommendations.data.Get.Book);
        setRecommendedBooks(recommendations.data.Get.Book);
      });

    setIsLoading(false);
    setLoadedOnce(true);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-neutral-950">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex justify-between ">
          <h3 className="mt-2 text-lg font-semibold text-neutral-100">
            {selectedBook?.title}
          </h3>
          <Button
            // className="bg-black text-white w-full rounded-none hover:bg-neutral-100 hover:text-black"
            className="bg-black hover:font-bold border rounded hover:bg-gray-700 p-2 w-20 hover:bg-neutral-100 hover:text-black"
            onClick={closeModal}
          >
            Close
          </Button>
        </div>
        <div>
          <div className="flex justify-center py-10">
            <div className="w-48 h-72 ">
              <img
                src={selectedBook?.thumbnail}
                alt={"Thumbnail of the book " + selectedBook?.title}
                className="w-full h-full rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="text-neutral-100">
            <p className="mt-1">
              <span className="font-bold">Authors</span>:{" "}
              {selectedBook?.authors}
            </p>
            <p>
              <span className="font-bold">Genre</span>:{" "}
              {selectedBook?.categories}
            </p>
            <p>
              <span className="font-bold">Rating</span>:{" "}
              {selectedBook?.average_rating}
            </p>
            <p>
              <span className="font-bold">Publication Year</span>:{" "}
              {selectedBook?.published_year}
            </p>
            <br />
            <p>{selectedBook?.description}</p>

            <div className="flex justify-center">
              {/* <a
                className="hover:animate-pulse"
                target="_blank"
                href={"https://www.amazon.com/s?k=" + selectedBook?.isbn10}
              >
                <img
                  className="w-60"
                  src="https://kentuckynerd.com/wp-content/uploads/2019/05/amazon-buy-now-button.jpg"
                />
              </a> */}
              <Button
                className="bg-black mt-8 border text-white w-2/5 rounded-none hover:bg-neutral-100 hover:text-black"
                onClick={() =>
                  window.open(
                    "https://www.amazon.com/s?k=" + selectedBook?.isbn10,
                    "_blank"
                  )
                }
              >
                Buy on Amazon
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="mb-auto py-10 px-4 bg-neutral-950">
        <div className="container mx-auto">
          <h1 className="text-3xl text-white font-black font-normal mb-6 text-center">
            Book Recommendations
          </h1>
          <div className="border-t border-gray-200 my-4"></div>

          <form
            id="recommendation-form"
            className="mb-10"
            onSubmit={getRecommendations}
          >
            <div className="mb-4 ">
              <label
                htmlFor="favorite-books"
                className="block text-white font-normal mb-2"
              >
                What would you like to get a book recommendation on?
              </label>
              <Input
                type="text"
                id="favorite-books"
                name="favorite-books"
                placeholder="I'd like to learn..."
                className="block w-full px-4 py-2 border border-white bg-neutral-950 text-neutral-300 rounded-none shadow-sm"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              {process.env.NEXT_PUBLIC_COHERE_CONFIGURED && (
                <>
                  <label
                    htmlFor="interests-input"
                    className="block text-white font-normal mb-2 pt-4"
                  >
                    Your interests and hobbies
                  </label>
                  <Input
                    type="text"
                    id="interests-input"
                    name="interests"
                    placeholder="Tell us about your hobbies and interests, comma separated..."
                    className="block w-full px-4 py-2 border border-gray-300 bg-neutral-950 text-neutral-300 rounded-none shadow-sm "
                    value={userInterests}
                    onChange={(e) => {
                      setUserInterests(e.target.value);
                    }}
                  />
                </>
              )}
            </div>
            <Button
              className="bg-black text-white w-full rounded-none hover:bg-neutral-100 hover:text-black"
              disabled={isLoading}
              type="submit"
              variant="outline"
            >
              Get Recommendations
            </Button>
          </form>

          {isLoading ? (
            <div className="w-full flex justify-center h-60 pt-10">
              <CircleLoader
                color={"#ffffff"}
                loading={isLoading}
                size={100}
                aria-label="Loading"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              {loadedOnce ? (
                <>
                  <h2 className="text-2xl font-normal mb-4 text-center">
                    Recommended Books
                  </h2>
                  <div
                    id="recommended-books"
                    className="flex overflow-x-scroll pb-10 hide-scroll-bar"
                  >
                    {/* <!-- Recommended books dynamically added here --> */}
                    <section className="container mx-auto mb-12">
                      <div className="flex flex-wrap -mx-2">
                        {recommendedBooks.map((book: Book) => {
                          return (
                            <div
                              key={book.isbn10 || book.isbn13}
                              className="w-full md:w-1/3 px-2 mb-4 animate-pop-in"
                            >
                              <div className="bg-neutral-950 border-solid border border-neutral-200 hover:shadow-lg hover:shadow-white p-6 flex items-center flex-col">
                                <div className="flex w-full justify-between">
                                  <h3 className="text-xl text-neutral-300 font-normal mb-4 line-clamp-1 text-center">
                                    {book.title}
                                  </h3>

                                  {process.env.NEXT_PUBLIC_COHERE_CONFIGURED &&
                                    book._additional.generate.error !=
                                      "connection to Cohere API failed with status: 429" && (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button className="rounded-full border-solid border border-neutral-300 p-2 bg-black cursor-pointer w-10 h-10">
                                            ✨
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 h-80 overflow-auto">
                                          <div>
                                            <p className="text-2xl font-bold">
                                              Why you&apos;ll like this book:
                                            </p>
                                            <br />
                                            <p>
                                              {
                                                book._additional.generate
                                                  .singleResult
                                              }
                                            </p>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    )}
                                </div>

                                <div className="w-48 h-72">
                                  <img
                                    src={book.thumbnail}
                                    alt={"Thumbnail of the book " + book.title}
                                    className="w-full h-full rounded-none shadow-lg"
                                  />
                                </div>
                                <p className="mt-4 text-neutral-100 line-clamp-1 mb-4">
                                  {book.authors}
                                </p>
                                <div className="flex">
                                  <Button
                                    className="bg-black text-white w-full rounded-none hover:bg-neutral-100 hover:text-black"
                                    type="submit"
                                    variant="outline"
                                    onClick={() => {
                                      openModal(book.title);
                                    }}
                                  >
                                    Learn More
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center h-60 pt-10"></div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="justify-center items-center bg-neutral-950 text-neutral-400	 h-20 flex flex-col">
        <div>
          Deploy it on &nbsp;
          <a
            href="https://vercel.com/templates/next.js/weaviate-bookrecs"
            className="underline text-neutral-100"
          >
            Vercel
          </a>{" "}
          and checkout the code on{" "}
          <a
            href="https://github.com/weaviate/BookRecs/"
            className="underline text-neutral-100"
          >
            Github
          </a>
          .
        </div>
        <div>
          Made with 😶‍🌫️ by &nbsp;
          <a
            href="https://junlings-superb-site111.webflow.io/"
            target="_blank"
            className="underline text-neutral-100"
          >
            @Junling Zhuang
          </a>{" "}
          &nbsp; and built with &nbsp;
          <a
            target="_blank"
            href="https://weaviate.io/"
            className="underline text-neutral-100"
          >
            Weaviate
          </a>
          .
        </div>
      </footer>
    </div>
  );
}
