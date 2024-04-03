import React from "react";
import Moon from "./Moon";
import Sun from "./Sun";


export default function DarkLight(props:{mode:boolean}){
  return (
    <>
      {
        props.mode 
        ? <Moon />
        : <Sun />
      }
    </>
  )
}
