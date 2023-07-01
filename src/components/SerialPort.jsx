import { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

const useSerialData = () => {
  const [buttonStates, setButtonStates] = useState({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    enter: 0,
  });

  useEffect(() => {
    const buttonNames = ["right", "down", "left", "up", "enter"];

    const eventListener = (event, data) => {
      const stateObject = JSON.parse(data);
      const resultObject = {};

      for (let i = 0; i < stateObject.btns.length; i++) {
        const buttonState = stateObject.btns[i];
        const buttonName = buttonNames[i];
        resultObject[buttonName] = parseInt(buttonState);
      }

      setButtonStates(resultObject);
    };

    ipcRenderer.on("serial-data", eventListener);

    return () => {
      ipcRenderer.removeListener("serial-data", eventListener);
    };
  }, []);

  return buttonStates;
};

export default useSerialData;
