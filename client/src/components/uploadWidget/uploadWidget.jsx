import { useEffect, useRef } from 'react';

const CloudinaryUploadWidget = ({ uwConfig, setPublicId, setState }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Enhanced configuration with file type restrictions
        const enhancedConfig = {
          ...uwConfig,
          // sources: ['local', 'camera'], // Only allow local files and camera
          resourceType: 'image', // Only allow images
          allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'], // Specify allowed image formats
          maxFileSize: 2000000, // 2MB max file size
          clientAllowedFormats: ['image'], // Restrict to image files on client side
          showAdvancedOptions: false, // Hide advanced options
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        };

        // Create upload widget with enhanced config
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          enhancedConfig,
          (error, result) => {
            if (error) {
              console.error('Upload error:', error);
              // Handle specific error cases
              if (error.status === 'invalid') {
                alert('Please upload only image files (JPG, PNG, GIF, WEBP)');
              } else if (error.status === 'max_file_size_exceeded') {
                alert('File size too large. Maximum size is 2MB');
              } else {
                alert('Upload failed. Please try again.');
              }
              return;
            }

            if (result && result.event === 'success') {
              console.log('Upload successful:', result.info);
              // Verify the uploaded file is an image
              if (result.info.resource_type === 'image') {
                setState(prev => [...prev, result.info.secure_url]);
              } else {
                alert('Please upload only image files');
              }
            }
          }
        );

        // Add click event to open widget
        const handleUploadClick = (e) => {
          e.preventDefault(); // Prevent any default behavior
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener('click', handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener('click', handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setPublicId, setState]);

  return (
    <div
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button"
      role="button"
      tabIndex={0}
      aria-label="Upload image"
    >
      Upload Image
    </div>
  );
};

export default CloudinaryUploadWidget;
