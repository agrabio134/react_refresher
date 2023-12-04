import React, { useState, useEffect } from "react";
import "./GalleryPage.css"; // Import your CSS file
import { Modal, Button, Descriptions, Image, Breadcrumb, Spin } from "antd";

const GalleryPage = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/api/get_gallery");
        const textData = await response.text();

        const jsonObjects = textData.split("}{").map((json, index, array) => {
          return index === 0
            ? json + "}"
            : index === array.length - 1
            ? "{" + json
            : "{" + json + "}";
        });

        jsonObjects.forEach((json) => {
          try {
            const parsedResult = JSON.parse(json);

            if (
              parsedResult.status &&
              parsedResult.status.remarks === "success"
            ) {
              setGalleryData(parsedResult.payload);
            } else {
              console.error(
                "Failed to fetch gallery data:",
                parsedResult.error
              );
            }
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (image) => {
    setCurrentImage(image);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleNextImage = () => {
    const currentIndex = galleryData.findIndex(
      (item) => item.id === currentImage.id
    );
    const nextIndex = currentIndex + 1;

    if (nextIndex >= galleryData.length) {
      setCurrentImage(galleryData[0]);
    } else {
      setCurrentImage(galleryData[nextIndex]);
    }
  };

  const handlePrevImage = () => {
    const currentIndex = galleryData.findIndex(
      (item) => item.id === currentImage.id
    );
    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      setCurrentImage(galleryData[galleryData.length - 1]);
    }
    else {
      setCurrentImage(galleryData[prevIndex]);
    }
    
  };

  return (
    <section className="main-gallery-container">
      <div className="gallery-welcome-container">
        <div className="gallery-content">
          <h1>
            <span className="span">Our</span> Gallery
          </h1>
          <ul className="gallery-breadcrumbs">
            <a href="">Home </a>
            <li href="">/</li>
            <a href="">Gallery</a>
          </ul>
        </div>
      </div>
      <div className="gallery-container">
        {loading ? (
          <Spin tip="Loading...">
            <p>Loading...</p>
          </Spin>
        ) : (
          <ul className="image-list">
            {galleryData.map((item) => (
              <li
                key={item.id}
                className="image-item"
                onClick={() => handleImageClick(item)}
              >
                <img
                  src={`${item.image}`}
                  alt={item.image}
                  style={{
                    cursor: "pointer",
                  }}
                />
                <div className="image-details">
                  <Descriptions>
                    <Descriptions.Item label="Description">
                      {item.description}
                    </Descriptions.Item>

                    {/* <Descriptions.Item label='Upload Date'>{item.upload_date}</Descriptions.Item> */}
                  </Descriptions>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Modal
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="prev" onClick={handlePrevImage}>
            Prev
          </Button>,
          
          // <Button key="close" onClick={handleModalClose}>
          //   Close
          // </Button>,
          <Button key="next" onClick={handleNextImage}>
            Next
          </Button>,

        ]}
      >
        {currentImage && (
          <div>
            <Image src={`${currentImage.image}`} alt={currentImage.image} />
            <div className="image-details">
              <p>{currentImage.description}</p>
              <Descriptions>
                <Descriptions.Item label="Upload Date">
                  {currentImage.upload_date}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default GalleryPage;
