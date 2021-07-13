import React, { useRef, useState } from "react";
import Konva from "konva";
import { Group, Text, Image, Rect } from "react-konva";
import useImage from "use-image";
import { Portal } from "react-konva-utils";

import { Theme } from "./theme";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Card as StoreCard } from "./store/cards";
import { playCard, selectAllCards } from "./store/gameSlice";
import { advisors } from "./store/advisors";
import { Button } from "./Button";

interface Props extends Konva.NodeConfig {
  width: number;
  height: number;
  cardKey: string;
  className?: string;
}

export const SmallCard = ({
  width,
  height,
  cardKey,
  className,
  ...other
}: Props) => {
  console.log(`Rendering: ${cardKey}`); // todo: remove
  const dispatch = useAppDispatch();
  const cards = useAppSelector(selectAllCards);
  const card: StoreCard = cards[cardKey];
  const [modal, setModal] = useState(false);
  const [modalBtns, setModalBtns] = useState(false);
  const [local, setLocal] = useState({ x: 0, y: 0 });

  // todo: base the image selection on advisor type?
  const path = "./icons/tcgcarddesign/grey_wood/";
  const [backSrc] = useImage(path + "back/back_grey_wood.png");
  const [bgSrc] = useImage(path + "card_title/bg_grey_wood.png");
  const [frameSrc] = useImage(path + "card_title/frame_grey_wood.png");
  const [slotSrc] = useImage(path + "card_title/slot_grey_wood.png");
  const [advisorSrc] = useImage(advisors[card.advisor].icon);
  const [mainSrc] = useImage("./icons/gr_05.png");

  const modalScale = 4.1;

  const r = useRef<Konva.Node>();
  const openModal = () => {
    const n = r.current;
    if (n) {
      const ap = n.getAbsolutePosition();
      const as = n.getAbsoluteScale();
      setLocal({ x: ap.x / as.x, y: ap.y / as.y });
      n.to({
        x: ap.x / as.x,
        y: ap.y / as.y,
        duration: 0,
        onFinish: () => {
          setModal(true);
          n.to({
            scaleX: modalScale,
            scaleY: modalScale,
            x: Theme.sceneWidth / 2 - (Theme.cardWidth / 2) * modalScale,
            y: Theme.spacing.sm,
            duration: 0.2,
            onFinish: () => {
              setModalBtns(true);
            },
          });
        },
      });
    }
  };

  const closeModal = () => {
    const n = r.current;
    if (n) {
      setModalBtns(false);
      n.to({
        scaleX: 1,
        scaleY: 1,
        x: local.x,
        y: local.y,
        duration: 0.2,
        onFinish: () => {
          setModal(false);
          n.to({
            x: other.x,
            y: other.y,
            duration: 0,
          });
        },
      });
    }
  };

  /*    
    n.to({
      scaleX: newScale,
      scaleY: newScale,
      offsetX: (ap.x/as.x-Theme.sceneWidth/2)/newScale+Theme.cardWidth/2,
      offsetY: (ap.y/as.y)/newScale - Theme.spacing.sm,
      duration: 0.2,
      onFinish:()=>{setModal(true)}
    });
    */

  return (
    <Portal selector=".top-layer" enabled={modal}>
      {modal ? (
        <Rect
          fill="black"
          opacity={0.7}
          width={Theme.sceneWidth}
          height={Theme.sceneHeight}
        />
      ) : null}
      <Group
        ref={r as any}
        className={className}
        {...other}
        width={width}
        height={height}
        onClick={() => openModal()}
      >
        <Image image={bgSrc} width={width} height={height} />
        <Image
          image={mainSrc}
          width={width * 0.91}
          height={height * 0.73}
          x={width * 0.05}
          y={height * 0.03}
        />
        <Image image={frameSrc} width={width} height={height} />
        <Image
          image={slotSrc}
          width={height * 0.2}
          height={height * 0.2}
          x={width * 0.666}
          y={height * 0.75}
        />
        <Image
          image={advisorSrc}
          width={height * 0.2}
          height={height * 0.2}
          x={width * 0.666}
          y={height * 0.75}
        />
        <Text
          text={card.label}
          fontSize={width * 0.08}
          width={width * 0.72}
          height={height * 0.08}
          x={width * 0.14}
          y={height * 0.68}
          fill={Theme.palette.text.primary}
        />
        <Text
          text={card.description}
          fontSize={width * 0.08}
          width={width * 0.55}
          height={height * 0.18}
          x={width * 0.11}
          y={height * 0.8}
          fill={Theme.palette.text.contrast}
        />
      </Group>
      {modalBtns ? (
        <>
          <Button
            text="Play Card"
            x={
              Theme.sceneWidth / 2 -
              (Theme.cardWidth / 2) * modalScale +
              Theme.spacing.md
            }
            y={Theme.sceneHeight * 0.87}
            onClick={() => {
              dispatch(playCard(card));
            }}
          />
          <Button
            text="Cancel"
            x={
              Theme.sceneWidth / 2 -
              (Theme.cardWidth / 2) * modalScale +
              Theme.spacing.xl4
            }
            y={Theme.sceneHeight * 0.87}
            onClick={() => closeModal()}
          />
        </>
      ) : null}
    </Portal>
  );
};
