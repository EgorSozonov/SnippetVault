import React from "react"


function KeyButton() {
  return (

        <svg width="30" scale="0.8" height="30" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="14" stroke="white" fill="transparent" stroke-width="1" />
            <circle cx="15" cy="8" r="4" stroke="white" fill="transparent" stroke-width="1" />
            <path stroke="white" stroke-width="1"
                d="M 10 15
                   H 20
                   C 20 20 22 22 15 25
                   C 8 22 10 20 10 15 "/>
        </svg>

  );
}

export default KeyButton;
