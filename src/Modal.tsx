import React from "react";
import { Rect } from "react-konva";
import { Portal } from "react-konva-utils";

import { Theme } from "./theme";

interface Props {
  showModal: boolean;
  portalSelector: string;
  children: JSX.Element;
}

export const Modal = ({ showModal, portalSelector, children }: Props) => {
  return (
    <Portal selector={portalSelector} enabled={showModal}>
      {showModal ? (
        <Rect
          fill="black"
          opacity={0.7}
          width={Theme.sceneWidth}
          height={Theme.sceneHeight}
        />
      ) : null}
      {children}
    </Portal>
  );
};
