import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./sub-char.scss";

const SubChar = ({ data }) => {
  // const [selectedChar, setSelectedChar] = useState("");
  const location = useLocation();
  const value = location.state.chars;
  const navigate = useNavigate();
  const chars = value.split("");
  const charFromOthers = location.state.choicesWords;
  const [selectedElement, setSelectedElement] = useState(0);
  const boxContainerRef = useRef(null);
  const [selectedChar, setSelectedChar] = useState(
    charFromOthers ? charFromOthers : ""
  );
  const handleCharClick = (char) => {
    setSelectedChar((prevChar) => prevChar + char);
  };

  const handleGoBack = () => {
    setSelectedChar((prevChar) => prevChar.slice(0, -1));
  };

  useEffect(() => {
    const activeButton = Object.keys(data).find((key) => data[key] === 1);
    let debounceTimer;
    if (activeButton) {
      setTimeout(() => {
        if (activeButton === "up") {
          console.log(activeButton);
          setSelectedElement((prevElement) => {
            if (prevElement === 1) {
              return prevElement - 1;
            } else if (prevElement === 2 || prevElement === 4) {
              return prevElement - 2;
            } else if (prevElement === 3) {
              return prevElement - 3;
            } else {
              return prevElement;
            }
          });
        } else if (activeButton === "left") {
          setSelectedElement((prevElement) => {
            if (prevElement === 0) {
              return prevElement + 1;
            } else if (prevElement === 2 || prevElement === 3) {
              return prevElement - 1;
            } else if (prevElement === 4) {
              return prevElement - 3;
            } else {
              return prevElement;
            }
          });
        } else if (activeButton === "down") {
          setSelectedElement((prevElement) => {
            if (prevElement === 0 || prevElement === 2) {
              return prevElement + 2;
            } else if (prevElement === 3) {
              return prevElement + 1;
            } else if (prevElement === 1) {
              return prevElement + 3;
            } else {
              return prevElement;
            }
          });
        } else if (activeButton === "right") {
          setSelectedElement((prevElement) => {
            if (prevElement === 0) {
              return prevElement + 3;
            } else if (prevElement === 1 || prevElement === 2) {
              return prevElement + 1;
            } else if (prevElement === 4) {
              return prevElement - 1;
            } else {
              return prevElement;
            }
          });
        } else if (activeButton === "enter") {
          if (selectedElement === 0) {
            handleCharClick(chars[0]);
          } else if (selectedElement === 1) {
            handleCharClick(chars[1]);
          } else if (selectedElement === 2) {
            // handleCharClick(chars[2]);
            //! will deal with that later
          } else if (selectedElement === 3) {
            handleCharClick(chars[2]);
            // handleGoBack();
          } else if (selectedElement === 4) {
            navigate("/", { state: { words: selectedChar } });
          }
        }
      }, 350); // Adjust the debounce time (in milliseconds) to your needs
    }
    return () => {
      clearTimeout();
    };
  }, [data, selectedElement, chars, navigate, selectedChar]);

  useEffect(() => {
    // Scroll the selected element into view
    const boxContainerElement = boxContainerRef.current;

    if (boxContainerElement) {
      const selectedElement = boxContainerElement.children[selectedElement];

      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedElement]);

  useEffect(() => {
    setSelectedElement(0); // Set the initial selected element to 0 on component mount
  }, []);

  return (
    <div className="sub-main">
      <span
        className={`char-box first-char ${
          selectedElement === 0 ? "selectedx" : ""
        }`}
        onClick={() => handleCharClick(chars[0])}
      >
        {chars[0]}
      </span>
      <div className="lower-characters">
        <span
          className={`char-box ${selectedElement === 1 ? "selectedx" : ""}`}
          onClick={() => handleCharClick(chars[1])}
        >
          {chars[1]}
        </span>
        <p
          className={`chosen-char ${selectedElement === 2 ? "selectedx" : ""}`}
        >
          {selectedChar}
        </p>
        <span
          className={`char-box ${selectedElement === 3 ? "selectedx" : ""}`}
          onClick={() => handleCharClick(chars[2])}
        >
          {chars[2] === " " ? "Space" : chars[2]}
        </span>
      </div>
      <Link
        className={`btn char-box ${selectedElement === 4 ? "selectedx" : ""}`}
        to="/"
        state={{ words: selectedChar }}
      >
        &#8592; back
      </Link>
    </div>
  );
};

export default SubChar;
