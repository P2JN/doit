import { useState } from "react";

import { mediaUtils } from "utils";

import { ModalDrawer } from "components/organisms";

const Image = (props: { src: string; alt: string }) => {
  const [showPreview, setShowPreview] = useState(false);

  const onOpenPreview = () => {
    setShowPreview(true);
  };

  const onClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      <img
        src={mediaUtils.sanitizeMediaUrl(props.src)}
        alt={props.alt}
        className="w-full cursor-pointer text-center"
        onClick={onOpenPreview}
      />
      {showPreview && (
        <ModalDrawer title="Vista previa" onClose={onClosePreview}>
          <img src={mediaUtils.sanitizeMediaUrl(props.src)} alt={props.alt} />
        </ModalDrawer>
      )}
    </>
  );
};

export default Image;
