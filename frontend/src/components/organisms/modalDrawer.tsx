import { ReactNode } from "react";

import { Modal, SwipeableDrawer } from "components/molecules";

const Component = (props: {
  title: string;
  children?: ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}) => {
  return (
    <>
      <div className="hidden md:inline">
        <Modal {...props}></Modal>
      </div>
      <div className="md:hidden">
        <SwipeableDrawer {...props}></SwipeableDrawer>
      </div>
    </>
  );
};

export default Component;
