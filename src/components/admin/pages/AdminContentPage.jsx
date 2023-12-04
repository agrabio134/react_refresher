import React, { useState } from "react";
import AdminBlogSection from "../components/AdminBlog";
import AdminGallerySection from "../components/AdminGallery";

const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState("blog"); // Default active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="tab-buttons">
        <button
          className={activeTab === "blog" ? "active-tab" : ""}
          onClick={() => handleTabChange("blog")}
        >
          Blog
        </button>
        <button
          className={activeTab === "gallery" ? "active-tab" : ""}
          onClick={() => handleTabChange("gallery")}
        >
          Gallery
        </button>
      </div>

      {activeTab === "blog" && <AdminBlogSection />}
      {activeTab === "gallery" && <AdminGallerySection />}
    </>
  );
};

export default AdminContentPage;
