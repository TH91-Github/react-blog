import React from "react";
import Moon from "./Moon";
import Sun from "./Sun";

interface DarkLightType {
  mode:boolean
  size?:number | undefined
}
export default function DarkLight({mode, size}:DarkLightType){
  const iconSize:number = size ?? 30;
  return (
    <>
      {
        mode 
        ? <Sun iconSize={iconSize} />
        : <Moon iconSize={iconSize} />
      }
    </>
  )
}
