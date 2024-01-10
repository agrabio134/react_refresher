import { useState, useEffect } from "react";
import AdminBlogSection from "../components/AdminBlog";
import AdminGallerySection from "../components/AdminGallery";

const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState("blog"); // Default active tab

  useEffect(() => {
    // Check if the flag is set to click the Gallery tab
    const shouldClickGallery = localStorage.getItem("autoClickGallery");
    if (shouldClickGallery === "true") {
      // Clear the flag
      localStorage.removeItem("autoClickGallery");

      // Activate the Gallery tab
      setActiveTab("gallery");
    }
  }, []);
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
          News & Announcements
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
