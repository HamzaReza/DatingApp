import React from "react";
import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

interface SvgIconProps {
  svgString: string;
  width?: number;
  height?: number;
  color?: string;
}

interface SvgElement {
  type:
    | "path"
    | "circle"
    | "rect"
    | "line"
    | "polygon"
    | "polyline"
    | "ellipse";
  attributes: Record<string, string>;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  svgString,
  width = 24,
  height = 24,
  color,
}) => {
  const parseSvgString = (svg: string) => {
    try {
      const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${width} ${height}`;

      const elements: SvgElement[] = [];

      const pathMatches = svg.match(/<path[^>]*>/g);
      if (pathMatches) {
        pathMatches.forEach(pathMatch => {
          const attributes: Record<string, string> = {};

          const attrMatches = pathMatch.match(/(\w+)="([^"]+)"/g);
          if (attrMatches) {
            attrMatches.forEach(attrMatch => {
              const [key, value] = attrMatch.split("=");
              attributes[key] = value.replace(/"/g, "");
            });
          }

          elements.push({ type: "path", attributes });
        });
      }

      const circleMatches = svg.match(/<circle[^>]*>/g);
      if (circleMatches) {
        circleMatches.forEach(circleMatch => {
          const attributes: Record<string, string> = {};

          const attrMatches = circleMatch.match(/(\w+)="([^"]+)"/g);
          if (attrMatches) {
            attrMatches.forEach(attrMatch => {
              const [key, value] = attrMatch.split("=");
              attributes[key] = value.replace(/"/g, "");
            });
          }

          elements.push({ type: "circle", attributes });
        });
      }

      const rectMatches = svg.match(/<rect[^>]*>/g);
      if (rectMatches) {
        rectMatches.forEach(rectMatch => {
          const attributes: Record<string, string> = {};

          const attrMatches = rectMatch.match(/(\w+)="([^"]+)"/g);
          if (attrMatches) {
            attrMatches.forEach(attrMatch => {
              const [key, value] = attrMatch.split("=");
              attributes[key] = value.replace(/"/g, "");
            });
          }

          elements.push({ type: "rect", attributes });
        });
      }

      return { viewBox, elements };
    } catch (error) {
      console.log("🚀 ~ SvgIcon.tsx:90 ~ parseSvgString ~ error:", error);
      return { viewBox: `0 0 ${width} ${height}`, elements: [] };
    }
  };

  const { viewBox, elements } = parseSvgString(svgString);

  if (elements.length === 0) {
    return <View style={{ width, height }} />;
  }

  const renderElement = (element: SvgElement, index: number) => {
    const { type, attributes } = element;

    const fillColor = color || attributes.fill || "#000";

    switch (type) {
      case "path":
        return (
          <Path
            key={index}
            d={attributes.d}
            fill={fillColor}
            stroke={attributes.stroke}
            strokeWidth={attributes.strokeWidth}
          />
        );
      case "circle":
        return (
          <Circle
            key={index}
            cx={attributes.cx}
            cy={attributes.cy}
            r={attributes.r}
            fill={fillColor}
            stroke={attributes.stroke}
            strokeWidth={attributes.strokeWidth}
          />
        );
      case "rect":
        return (
          <Rect
            key={index}
            x={attributes.x}
            y={attributes.y}
            width={attributes.width}
            height={attributes.height}
            fill={fillColor}
            stroke={attributes.stroke}
            strokeWidth={attributes.strokeWidth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Svg width={width} height={height} viewBox={viewBox}>
      {elements.map((element, index) => renderElement(element, index))}
    </Svg>
  );
};

export default SvgIcon;
