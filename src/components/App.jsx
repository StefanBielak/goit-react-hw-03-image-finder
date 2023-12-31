import React, { useState } from "react";
import Searchbar from "./Searchbar/Searchbar";
import ImageGallery from "./ImageGallery/ImageGallery";
import Button from "./Button/Button";
import Loader from "./Loader";
import Modal from "./Modal/Modal";
import styles from './App.module.css';

const API_KEY = "39441278-dab432af90fd5d2445b56ddfd";
const BASE_URL = "https://pixabay.com/api/";

export const App = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setImages([]);
    fetchImages(searchQuery, 1);
  };

  const fetchImages = (searchQuery, pageNumber) => {
    setIsLoading(true);
    fetch(
      `${BASE_URL}?q=${searchQuery}&page=${pageNumber}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then((response) => response.json())
      .then((data) => {
        setImages((prevImages) => [...prevImages, ...data.hits]);
        setPage(pageNumber + 1);
      })
      .catch((error) => console.error("Error fetching data: ", error))
      .finally(() => setIsLoading(false));
  };

  const loadMoreImages = () => {
    fetchImages(query, page);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image.largeImageURL);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.app}>
      <Searchbar onSubmit={handleSearchSubmit} />
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && <Button onClick={loadMoreImages} isVisible={true} />}
      {selectedImage && <Modal onClose={closeModal} largeImageURL={selectedImage} />}
    </div>
  );
};