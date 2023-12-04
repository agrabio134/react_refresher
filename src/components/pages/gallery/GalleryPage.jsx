import React, { useState, useEffect } from 'react';
import './GalleryPage.css'; // Import your CSS file


const GalleryPage = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/api/get_gallery');
        const textData = await response.text(); // Get the raw response as text

        // console.log('Raw Response:', textData); // Log the raw response content

        // Split the response into individual JSON objects
        const jsonObjects = textData
          .split('}{')
          .map((json, index, array) => {
            // Add '}' back to the first object and '{' back to the last object
            return index === 0
              ? json + '}'
              : index === array.length - 1
              ? '{' + json
              : '{' + json + '}';
          });

        // Parse each JSON object
        jsonObjects.forEach((json) => {
          try {
            const parsedResult = JSON.parse(json);

            if (parsedResult.status && parsedResult.status.remarks === 'success') {
              setGalleryData(parsedResult.payload);
            } else {
              // console.error('Failed to fetch gallery data:', parsedResult.error);
            }
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className='main-gallery-container'>
    <div className='gallery-welcome-container'>
    <div className="gallery-content">
          <h1><span className="span">Our</span> Gallery</h1>
          <ul className='gallery-breadcrumbs'>
          <a href="">Home </a>
          <li href="">/</li>
          <a href="">Gallery</a>
          </ul>
        </div>
    </div>
    <div className="gallery-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="image-list">
          {galleryData.map((item) => (
            <li key={item.id} className="image-item">
              <img src={`${item.image}`} alt={item.image} />
              <div className="image-details">
                <p>{item.description}</p>
                <p>Upload Date: {item.upload_date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
</section>
  );
};

export default GalleryPage;
