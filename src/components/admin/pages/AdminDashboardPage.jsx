// AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faImages,
  faEdit,
  faClock,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/AdminDashboardPage.css";
import Swal from "sweetalert2";

const AdminDashboardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [pendingAppointmentCount, setPendingAppointmentCount] = useState(0);
  const [scheduledAppointmentCount, setScheduledAppointmentCount] = useState(0);
  const [unpublishedBlogPosts, setUnpublishedBlogPosts] = useState([]);
  const [publishedBlogPosts, setPublishedBlogPosts] = useState([]);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const textData = await response.text();

      return textData
        .split("}{")
        .map((json, index, array) =>
          index === 0
            ? json + "}"
            : index === array.length - 1
            ? "{" + json
            : "{" + json + "}"
        )
        .flatMap((json) => {
          try {
            const parsedResult = JSON.parse(json);
            return parsedResult.payload || [];
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return [];
          }
        });
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      setUserCount(
        (await fetchData("http://localhost/api/get_total_users")).length
      );
      setGalleryCount(
        (await fetchData("http://localhost/api/get_total_gallery")).length
      );
      setBlogCount(
        (await fetchData("http://localhost/api/get_total_blog_posts")).length
      );

      const pendingAppointments = await fetchData(
        "http://localhost/api/get_total_pending_appointments"
      );
      const scheduledAppointments = await fetchData(
        "http://localhost/api/get_total_accepted_appointments"
      );

      setPendingAppointmentCount(pendingAppointments.length);
      setScheduledAppointmentCount(scheduledAppointments.length);
    };

    fetchDataAndUpdateState();
    fetchBlogData(
      "http://localhost/api/get_unpublished_blog_posts",
      setUnpublishedBlogPosts
    );
    fetchBlogData(
      "http://localhost/api/get_published_blog_posts",
      setPublishedBlogPosts
    );
  }, []); // Fix: Added dependency array

  const fetchBlogData = async (url, setBlogPosts) => {
    const response = await fetch(url);
    const textData = await response.text();
    const jsonObjects = textData
      .split("}{")
      .map((json, index, array) =>
        index === 0
          ? json + "}"
          : index === array.length - 1
          ? "{" + json
          : "{" + json + "}"
      );

    const blogPosts = jsonObjects.flatMap((json) => {
      try {
        const parsedResult = JSON.parse(json);
        return parsedResult.payload || [];
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        return [];
      }
    });

    console.log(blogPosts);
    setBlogPosts(blogPosts);
  };

  const handlePublish = (blogPost) => {
    Swal.fire({
      title: "Are you sure you want to publish this blog post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Publish",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmPublish(blogPost);
        Swal.fire({
          title: "Published",
          icon: "success",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const confirmPublish = async (blogPost) => {
    const blogPostId = blogPost.id;
    console.log(blogPostId);

    try {
      const response = await fetch(
        `http://localhost/api/publish_blog_post/${blogPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blogPostId),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to publish blog post: ${response.status}`);
      }

      const textData = await response.text();
      const parsedResult = JSON.parse(textData);

      if (parsedResult.success) {
        alert("Blog post published successfully!");
      }
    } catch (error) {
      console.error(`Error publishing blog post: ${error.message}`);
    }
  };

  const handleEdit = (blogPost) => {
    // Add logic for editing a blog post
  };

  const handleDelete = (blogPost) => {
    // Add logic for deleting a blog post
  };


  const handleUnpublish = (blogPost) => {
    Swal.fire({
      title: "Are you sure you want to unpublish this blog post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Unpublish",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmUnpublish(blogPost);
        Swal.fire({
          title: "Unpublished",
          icon: "success",
          confirmButtonText: "Okay",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const confirmUnpublish = async (blogPost) => {
    const blogPostId = blogPost.id;

    try {
      const response = await fetch(
        `http://localhost/api/unpublish_blog_post/${blogPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blogPostId),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to unpublish blog post: ${response.status}`);
      }

      const textData = await response.text();
      const parsedResult = JSON.parse(textData);

      if (parsedResult.success) {
        alert("Blog post unpublished successfully!");
      }
    } catch (error) {
      console.error(`Error unpublishing blog post: ${error.message}`);
    }
  };
  return (
    <div>
      <div className="card-container">
        <div className="card user-card">
          <FontAwesomeIcon icon={faUsers} size="2x" />
          <h2>Total Users</h2>
          <p>{userCount}</p>
        </div>
        <div className="card gallery-card">
          <FontAwesomeIcon icon={faImages} size="2x" />
          <h2>Gallery Items</h2>
          <p>{galleryCount}</p>
        </div>
        <div className="card blog-card">
          <FontAwesomeIcon icon={faEdit} size="2x" />
          <h2>Published Blogs</h2>
          <p>{blogCount}</p>
        </div>
        <div className="card pending-appointment-card">
          <FontAwesomeIcon icon={faClock} size="2x" />
          <h2>Pending Appointment</h2>
          <p>{pendingAppointmentCount}</p>
        </div>
        <div className="card accepted-appointment-card">
          <FontAwesomeIcon icon={faCalendarAlt} size="2x" />
          <h2>Scheduled Appointment</h2>
          <p>{scheduledAppointmentCount}</p>
        </div>
      </div>

      <h2>Unpublished Blog Posts</h2>

      <div className="admin-dashboard-unpublished-blog-posts">
        {unpublishedBlogPosts.map((blogPost) => (
          <div key={blogPost.id} className="admin-dashboard-blog-card">
            <div className="admin-dashboard-blog-card-content">
              <img src={`${blogPost.thumbnail}`} alt="" />
              <h3>{blogPost.title}</h3>
              <div className="blog-post-content-container">
                <p className="blog-post-content">{blogPost.content}</p>
              </div>
            </div>
            <div className="admin-dashboard-blog-card-buttons">
              <button onClick={() => handlePublish(blogPost)}>Publish</button>
              <button className="edit" onClick={() => handleEdit(blogPost)}>
                Edit
              </button>

              <button className="delete" onClick={() => handleDelete(blogPost)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Published Blog Posts</h2>

      <div className="admin-dashboard-unpublished-blog-posts">
        {publishedBlogPosts.map((blogPost) => (
          <div key={blogPost.id} className="admin-dashboard-blog-card">
            <div className="admin-dashboard-blog-card-content">
              <img src={`/blog/${blogPost.thumbnail}`} alt="" />
              <h3>{blogPost.title}</h3>
              <div className="blog-post-content-container">
                <p className="blog-post-content">{blogPost.content}</p>
              </div>
            </div>
            <div className="admin-dashboard-blog-card-buttons">
            <button
                className="unpublish"
                onClick={() => handleUnpublish(blogPost)}
              >
                Unpublished
              </button>
              <button className="edit" onClick={() => handleEdit(blogPost)}>
                Edit
              </button>

              <button className="delete" onClick={() => handleDelete(blogPost)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminDashboardPage;
