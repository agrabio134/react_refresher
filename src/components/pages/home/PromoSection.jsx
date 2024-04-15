import "./Style/PromoSection.css";
import React, { useState, useEffect } from 'react';
import { Image } from 'antd';

const PromoSection = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://happypawsolongapo.com/api/get_blog_posts');
        const textData = await response.text(); // Get the raw response as text

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
              setBlogData(parsedResult.payload);
            } else {
              // Handle error if needed
            }
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section id="promo">
        <div className="promo-main-box-container">
            <h2>Promos</h2>
            <div class="bar"></div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem in numquam, architecto cum qui dolorum recusandae adipisci vero magnam obcaecati doloribus eaque doloremque tempore temporibus distinctio veritatis sequi! Itaque, quisquam?</p>
            <div className="promo-card-main-container">
            {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="promo-list">
          {blogData.map((post) => (
            <div key={post.id} className="promo-post">
              <Image src={`${post.thumbnail}`} alt={post.title} />
            </div>
          ))}
        </div>
      )}
            </div>
        </div>
      </section>
    </>
  );
};

export default PromoSection;