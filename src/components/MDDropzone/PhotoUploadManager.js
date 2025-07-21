import React, { useState } from "react";
import MDDropzone from 'components/MDDropzone';
import MDButton from 'components/MDButton';

const PhotoUploadManager = ({ options }) => {
  const [showDropzone, setShowDropzone] = useState(false);

  const dropzoneOptions = {
    url: "/upload",
    maxFiles: 1,
    autoProcessQueue: false,
    acceptedFiles: "image/*",
    addRemoveLinks: true,
    dictDefaultMessage: "Déposez une image ici ou cliquez",
    init: function () {
      this.on("removedfile", () => setShowDropzone(false));
    },
  };

  return (
    <div>
      <MDButton
        variant="contained"
        onClick={() => setShowDropzone(true)}
        disabled={showDropzone}
      >
        Ajouter une photo
      </MDButton>

      {showDropzone && <MDDropzone options={dropzoneOptions} />}
    </div>
  );
};

export default PhotoUploadManager;
