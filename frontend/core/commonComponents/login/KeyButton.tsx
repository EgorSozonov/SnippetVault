import React from "react"

function KeyButton() {
  return (

        <svg width="30" height="30" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="14" fill="transparent" strokeWidth="1" />
            <circle cx="15" cy="9" r="3.5" fill="transparent" strokeWidth="1" />
            <path strokeWidth="1"
                d="M 14 13.9
                   A 5 5 286 1 1 16 13.9"/>
            <path strokeWidth="1"
                d="M 16 13.9
                    V 27 L 14 26" />
            <path strokeWidth="1"
                d="M 14 26
                     V 24 H 12 V 22 L 14 21 V 19 H 12 V 17 H 14 V 13.9" />
        </svg>
  );
}

export default KeyButton;
