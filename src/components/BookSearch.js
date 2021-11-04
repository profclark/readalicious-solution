import React, { useEffect, useState, useCallback } from "react";
import SearchResults from "./SearchResults";

const BookSearch = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getBooks = useCallback(async () => {
    const API_HOST = "USE_YOUR_URL";
    const API_KEY = "USE_YOUR_API_KEY";

    try {
      setErrorMessage("");

      if (!searchText) {
        setSearchResult([]);
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_HOST}/volumes?q=${searchText}&maxResults=15&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      let transformed = [];
      if (data.items) {
        transformed = data.items.map((item) => {
          const images = item.volumeInfo.imageLinks;
          return {
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            publishedDate: item.volumeInfo.publishedDate,
            thumbnail: images ? images.thumbnail : null,
          };
        });
      }

      setSearchResult(transformed);
    } catch (ex) {
      setErrorMessage("Something went wrong.");
    }

    setLoading(false);
  }, [searchText]);

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getBooks();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText, getBooks]);

  let resultDisplay = <p className="feedback">Found nothing to read.</p>;

  if (errorMessage) {
    resultDisplay = <p className="feedback">{errorMessage}</p>;
  } else if (loading) {
    resultDisplay = <p className="feedback">Loading ...</p>;
  } else if (searchResult.length > 0) {
    resultDisplay = <SearchResults books={searchResult} />;
  }

  return (
    <section className="bookSearch">
      <div className="container">
        <div className="control">
          <input
            type="search"
            placeholder="Search by title or author"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </div>
        {resultDisplay}
      </div>
    </section>
  );
};

export default BookSearch;
