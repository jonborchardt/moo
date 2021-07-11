import React from "react";
import Konva from "konva";
import { Group, Text, Rect } from "react-konva";

export const Hand = (props: Konva.NodeConfig) => {
  return (
    <Group {...props}>
      <Rect width={props.width} height={props.height} fill="yellow" />
      <Text
        text="Card 1 with a long name"
        fontSize={60}
        width={props.width}
        height={200}
      />
      <Text text="Card2" fontSize={60} y={200} />
    </Group>
  );
};
