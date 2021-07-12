import React, { useRef } from "react";
import Konva from "konva";
import { Label, Tag, Text } from "react-konva";

interface Props extends Konva.NodeConfig {
  width: number;
  height: number;
}

export const Button = (props: Props) => {
  const r = useRef<Konva.Node>();
  const changeSize = () => {
    r.current?.to({
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 0.2,
      onFinish: function () {
        r.current?.to({
          scaleX: 1,
          scaleY: 1,
          duration: 0.2,
        });
      },
    });
  };

  return (
    <Label
      opacity={0.75}
      {...props}
      ref={r as any}
      onClick={() => {
        changeSize();
        props.onClick();
      }}
    >
      <Tag
        fill="black"
        lineJoin="round"
        shadowColor="black"
        shadowBlur={10}
        shadowOffset={{ x: 10, y: 10 }}
        shadowOpacity={0.5}
      />
      <Text
        text={props.text}
        fontFamily="Calibri"
        fontSize={props.height}
        padding={5}
        fill="white"
      />
    </Label>
  );
};
