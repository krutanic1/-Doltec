import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import API from "../API";
import { getCardImageUrl, getFullImageUrl, getThumbnailUrl } from "../utils/CloudinaryUtils";

/**
 * LazyImage component with Intersection Observer
 */
const LazyImage = ({ src, alt, className, isLoaded, onLoad }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current && !isLoaded) {
          imgRef.current.src = src;
          imgRef.current.onload = onLoad;
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, isLoaded, onLoad]);

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={className}
      src={isLoaded ? undefined : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"}
    />
  );
};

const RealEstate = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const WHATSAPP_NUMBER = "919324504318";
  const propertiesPerPage = 30;

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/real-estate`, {
        params: {
          page,
          limit: propertiesPerPage,
        },
      });

      if (Array.isArray(response.data)) {
        setProperties(response.data || []);
        setTotalPages(1);
        return;
      }

      setProperties(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setCurrentPage(response.data?.currentPage || page);

      const pageParam = searchParams.get("page");
      const expectedPage = String(response.data?.currentPage || page);
      if (pageParam !== expectedPage) {
        const nextParams = new URLSearchParams(searchParams);
        if (response.data?.currentPage && response.data.currentPage > 1) {
          nextParams.set("page", expectedPage);
        } else {
          nextParams.delete("page");
        }
        setSearchParams(nextParams, { replace: true });
      }
    } catch (error) {
      console.error("Error fetching real estate properties:", error);
      setProperties([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
    fetchProperties(pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageFromUrl]);

  const handleImageLoad = (propertyId) => {
    setLoadedImages((prev) => ({
      ...prev,
      [propertyId]: true,
    }));
  };

  const openGallery = (property, startIndex = 0) => {
    setSelectedProperty(property);
    setCurrentImageIndex(startIndex);
  };

  const closeGallery = () => {
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % selectedProperty.imageUrls.length
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedProperty.imageUrls.length) %
          selectedProperty.imageUrls.length
      );
    }
  };

  return (
    <div id="real-estate-page">
      <section className="real-estate-hero">
        <h2>Real Estate</h2>
        <p>Verified listings posted directly by Doltec admin.</p>
      </section>

      <section className="real-estate-grid-wrap">
        {loading ? (
          <p className="loading-state">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="empty-state">No properties posted yet.</p>
        ) : (
          <>
          <div className="real-estate-grid">
            {properties.map((property) => (
              <article className="real-estate-card" key={property._id}>
                <div className="image-strip">
                  {property.imageUrls?.[0] ? (
                    <>
                      <div className={`skeleton-loader ${loadedImages[property._id] ? "loaded" : ""}`} />
                      <LazyImage
                        src={getCardImageUrl(property.imageUrls[0])}
                        alt={property.propertyName}
                        className="property-image"
                        isLoaded={loadedImages[property._id]}
                        onLoad={() => handleImageLoad(property._id)}
                      />
                    </>
                  ) : (
                    <div className="image-placeholder">No image available</div>
                  )}
                </div>

                <div className="card-content">
                  <h3>{property.propertyName}</h3>
                  <p className="location-text">{property.location}</p>

                  <div className="card-actions">
                    <button
                      className="view-btn"
                      onClick={() => openGallery(property)}
                    >
                      View ({property.imageUrls?.length || 0} images)
                    </button>
                    <button
                      type="button"
                      className="whatsapp-btn"
                      onClick={() => setShowContactPopup(true)}
                    >
                      <i className="fa fa-whatsapp"></i> Connect
                    </button>
                  </div>

                  <a
                    href={property.locationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="location-link"
                  >
                    View Location Link
                  </a>
                  <p className="admin-meta">
                    Posted by {property.createdByAdminName || "Admin"}
                  </p>
                </div>
              </article>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => {
                  const prevPage = Math.max(1, currentPage - 1);
                  const nextParams = new URLSearchParams(searchParams);
                  if (prevPage === 1) {
                    nextParams.delete("page");
                  } else {
                    nextParams.set("page", String(prevPage));
                  }
                  setSearchParams(nextParams);
                }}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="pagination-btn"
                onClick={() => {
                  const nextPage = Math.min(totalPages, currentPage + 1);
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set("page", String(nextPage));
                  setSearchParams(nextParams);
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          </>
        )}
      </section>

      {selectedProperty && (
        <div className="gallery-modal" onClick={closeGallery}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={closeGallery}>
              ×
            </button>

            <div className="gallery-main">
              <img
                src={getFullImageUrl(selectedProperty.imageUrls[currentImageIndex])}
                alt={`${selectedProperty.propertyName} ${currentImageIndex + 1}`}
              />
            </div>

            <button
              className="gallery-nav gallery-prev"
              onClick={prevImage}
              disabled={selectedProperty.imageUrls.length <= 1}
            >
              ❮
            </button>
            <button
              className="gallery-nav gallery-next"
              onClick={nextImage}
              disabled={selectedProperty.imageUrls.length <= 1}
            >
              ❯
            </button>

            <div className="gallery-counter">
              {currentImageIndex + 1} / {selectedProperty.imageUrls.length}
            </div>

            <div className="gallery-thumbnails">
              {selectedProperty.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={getThumbnailUrl(url)}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showContactPopup && (
        <div className="contact-popup-overlay" onClick={() => setShowContactPopup(false)}>
          <div className="contact-popup" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="contact-popup-close"
              onClick={() => setShowContactPopup(false)}
            >
              ×
            </button>
            <div className="contact-popup-title">Connect</div>
            <div className="contact-popup-name">Suryansh</div>
            <div className="contact-popup-number">+91 93245 04318</div>
            <a
              className="contact-popup-whatsapp"
              href="https://wa.me/919324504318"
              target="_blank"
              rel="noreferrer"
              aria-label="Open WhatsApp"
            >
              <i className="fa fa-whatsapp"></i>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstate;
