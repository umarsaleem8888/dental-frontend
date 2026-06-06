import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Props {
  image: string;
  buttonText?: string;
  className?: string;
}

const ImageViewer: React.FC<Props> = ({
  image,
  buttonText = "Preview",
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  if (!image) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${className}`}
      >
        {buttonText}
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: image }]}
      />
    </>
  );
};

export default ImageViewer;