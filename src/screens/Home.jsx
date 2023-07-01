import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./home.scss";
// import "./style.css";

const choices = ["ABC", "CDE", "GHI", "JKL", "MNO", "PQR", "STU", "VWX", "Y_Z"];
const Home = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const boxContainerRef = useRef(null);
  const [selectedChar, setSelectedChar] = useState("");
  const location = useLocation();
  const choicesWords = location.state?.words ? location.state.words : "";
  const handleCharSelection = (char) => {
    setSelectedChar(char);
    console.log("Here");
  };
  //?
  useEffect(() => {
    const activeButton = Object.keys(data).find((key) => data[key] === 1);
    // let debounceTimer;

    if (activeButton) {
      setTimeout(() => {
        if (activeButton === "up") {
          setSelectedIndex((prevIndex) =>
            prevIndex === 0 || prevIndex < 3 ? prevIndex : prevIndex - 3
          );
        } else if (activeButton === "left") {
          setSelectedIndex((prevIndex) =>
            prevIndex === 0 ? prevIndex : prevIndex - 1
          );
        } else if (activeButton === "down") {
          setSelectedIndex((prevIndex) =>
            prevIndex > 5 ? prevIndex : prevIndex + 3
          );
        } else if (activeButton === "right") {
          setSelectedIndex((prevIndex) =>
            prevIndex === choices.length - 1 ? prevIndex : prevIndex + 1
          );
        } else if (activeButton === "enter") {
          navigate("/sub", {
            state: { chars: choices[selectedIndex], choicesWords },
          });
        }
      }, 350); // Adjust the debounce time (in milliseconds) to your needs
    }

    return () => {
      clearTimeout();
    };
  }, [data, selectedIndex, choicesWords, navigate]);

  //?
  useEffect(() => {
    // Scroll the selected choice into view
    const boxContainerElement = boxContainerRef.current;
    const selectedBoxElement = boxContainerElement.children[selectedIndex];

    if (selectedBoxElement) {
      selectedBoxElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedIndex]);

  function Box({ value, index }) {
    const isSelected = index === selectedIndex;

    return (
      <span
        className={`box ${isSelected ? "selected" : ""}`}
        onClick={() =>
          navigate("/sub", {
            state: { chars: choices[selectedIndex], choicesWords },
          })
        }
      >
        {value}
      </span>
    );
  }

  useEffect(() => {
    setSelectedIndex(0); // Set the initial selected index to 0 on component mount
  }, []);

  // Helper function to prevent default mouse events
  const preventDefault = (event) => {
    event.preventDefault();
  };

  return (
    <div className="boxes">
      <div className="header">{choicesWords}</div>
      <div className="content">
        <div className="box-container" ref={boxContainerRef}>
          {choices.map((value, index) => (
            <Box
              key={index}
              value={value}
              index={index}
              handleCharSelection={() => handleCharSelection(value)}
            />
          ))}
        </div>
      </div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default Home;
