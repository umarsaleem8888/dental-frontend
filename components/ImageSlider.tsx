import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface ImageSlide {
  src: string;
  title?: string;
  description?: string;
}

interface ImageSliderProps {
  open: boolean;
  images: ImageSlide[];
  currentIndex?: number;
  onClose: () => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  open,
  images,
  currentIndex = 0,
  onClose,
}) => {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={currentIndex}
      slides={images}
    />
  );
};

export default ImageSlider;