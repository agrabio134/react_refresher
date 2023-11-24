import React, { useState, useEffect } from "react";
import "./BlogPage.css"; // Import your CSS file

const BlogPage = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/api/get_blog_posts");
        const textData = await response.text(); // Get the raw response as text

        // Split the response into individual JSON objects
        const jsonObjects = textData.split("}{").map((json, index, array) => {
          // Add '}' back to the first object and '{' back to the last object
          return index === 0
            ? json + "}"
            : index === array.length - 1
            ? "{" + json
            : "{" + json + "}";
        });

        // Parse each JSON object
        jsonObjects.forEach((json) => {
          try {
            const parsedResult = JSON.parse(json);

            if (
              parsedResult.status &&
              parsedResult.status.remarks === "success"
            ) {
              setBlogData(parsedResult.payload);
            } else {
              // Handle error if needed
            }
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="blog-container">
      <div className="sidebar">
        <h2>Latest Upload</h2>
        {loading ? (
          <p>Loading latest upload...</p>
        ) : (
          blogData.length > 0 && (
            <div className="latest-upload">
              <img
                src={`/blog/${blogData[0].thumbnail}`}
                alt={blogData[0].title}
              />
              <div className="upload-details">
                <h3>{blogData[0].title}</h3>
                <p>{blogData[0].description}</p>
              </div>
            </div>
          )
        )}
        <hr />
        <h3>Categories</h3>
        <ul>{/* Categories list */}</ul>
        <hr />
        <h3>Popular Posts</h3>
        <ul>{/* Popular posts list */}</ul>
        {/* Add more relevant content based on your blog's focus */}
      </div>
      <div className="main-content">
        <h1>Blog Page</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="blog-list">
            {blogData.map((post) => (
              <li key={post.id} className="blog-post">
                <img src={`/blog/${post.thumbnail}`} alt={post.title} />
                <div className="blog-details">
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <p>Date Created: {post.date_created}</p>
                  <p>Date Modified: {post.date_modified}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
