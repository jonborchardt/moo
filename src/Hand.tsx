import React from "react";
import Konva from "konva";
import { Group, Text, Rect, Image } from "react-konva";
import useImage from "use-image";

import BackSrc from './icons/tcgcarddesign/grey_wood/back/back_grey_wood.png';

interface Props extends Konva.NodeConfig {
  width: number;
  height: number;
}

export const Hand = (props: Props) => {
  const path = './icons/tcgcarddesign/grey_wood/';
  const [backSrc] = useImage(path+'back/back_grey_wood.png');
  const [bgSrc] = useImage(path+'card_title/bg_grey_wood.png');
  const [frameSrc] = useImage(path+'card_title/frame_grey_wood.png');
  const [slotSrc] = useImage(path+'card_title/slot_grey_wood.png');
  return (
    <Group {...props}>
      <Image image={bgSrc} width={props.width} height={props.height} /> 
      <Image image={frameSrc} width={props.width} height={props.height}/> 
      <Image image={slotSrc} width={props.height*0.2} height={props.height*0.2} 
      x={props.width*0.666} y={props.height*0.75}/> 
      <Text
        text="Card 1 with a long name"
        fontSize={60}
        width={props.width}
        height={200}
        fill={'white'}
      />
      <Text text="Card2" fontSize={60} y={200} />
    </Group>
  );
};