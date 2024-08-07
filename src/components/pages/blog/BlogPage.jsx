import React, { useState, useEffect } from 'react';
import './BlogPage.css'; // Import your CSS file
import { Image } from 'antd';

const BlogPage = () => {
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
    <section className='main-blog-container'>
    <div className='blog-welcome-container'>
    <div className="blog-content">
          <h1><span className="span">Our</span> Promos</h1>
          <ul className='blog-breadcrumbs'>
          <a href="/">Home </a>
          <li href="">/</li>
          <a href="/blogs">Promos </a>
          </ul>
        </div>
    </div>
    <div className="blog-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="blog-list">
          {blogData.map((post) => (
            <li key={post.id} className="blog-post">
              <div className='promo-img-fixed-size'>
                <Image src={`${post.thumbnail}`} alt={post.title} />
              </div>
              <div className="blog-details">
                <h2>{post.title}</h2>
                <div className="blog-separator"></div>
                <p>{post.content}</p>
                {/* <p>Date Created: {post.date_created}</p>
                <p>Date Modified: {post.date_modified}</p> */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </section>
  );
};

export default BlogPage;
