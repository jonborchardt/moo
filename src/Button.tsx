import React, { useRef } from "react";
import Konva from "konva";
import { Label, Tag, Text } from "react-konva";

import { Theme } from "./theme";

interface Props extends Konva.NodeConfig {}

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
        fill={Theme.palette.background.dark}
        lineJoin="round"
        shadowColor={Theme.palette.common.black}
        shadowBlur={Theme.spacing.xxs}
        shadowOffset={{ x: Theme.spacing.xxs, y: Theme.spacing.xxs }}
        shadowOpacity={0.5}
      />
      <Text
        text={props.text}
        fontFamily={Theme.font.family}
        fontSize={Theme.textStyles.normal}
        padding={Theme.spacing.xxs}
        fill={Theme.palette.text.contrast}
      />
    </Label>
  );
};
