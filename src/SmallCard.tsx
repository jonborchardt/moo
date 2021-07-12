import React from "react";
import Konva from "konva";
import { Group, Text, Image } from "react-konva";
import useImage from "use-image";

import { Theme } from "./theme";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Card as StoreCard } from "./store/cards";
import { playCard, selectAllCards } from "./store/gameSlice";
import { advisors } from "./store/advisors";

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

  // todo: base the image selection on advisor type?
  const path = "./icons/tcgcarddesign/grey_wood/";
  const [backSrc] = useImage(path + "back/back_grey_wood.png");
  const [bgSrc] = useImage(path + "card_title/bg_grey_wood.png");
  const [frameSrc] = useImage(path + "card_title/frame_grey_wood.png");
  const [slotSrc] = useImage(path + "card_title/slot_grey_wood.png");
  const [advisorSrc] = useImage(advisors[card.advisor].icon);
  const [mainSrc] = useImage("./icons/gr_05.png");

  return (
    <Group
      className={className}
      {...other}
      width={width}
      height={height}
      onClick={() => dispatch(playCard(card))}
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
  );
};
