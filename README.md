# SerialPort-Electron-Vite-React

This project is built to read serial data from 5 buttons connected to an Arduino board using Electron, Vite, and React. The user can interact with the buttons to input characters and form words.

## Features

- Read serial data from 5 buttons connected to Arduino.
- Electron framework for building cross-platform desktop applications.
- Vite for fast development and optimized builds.
- React for building the user interface.
- User-friendly interface for inputting characters and forming words.



## Prerequisites

Before getting started, make sure you have the following prerequisites:

- Node.js installed on your machine
- Yarn or npm package managers

## Getting Started

### Clone the Repository

Clone this repository to your local machine:

```shell
git clone https://github.com/awssalrawi/SerialPort-Electron-Vite-React.git

Install Dependencies
Navigate to the project directory:

cd SerialPort-Electron-Vite-React
Install the project dependencies using yarn or npm:
Using yarn:
yarn install
Using npm:
npm install

Run the Application
After the build process is complete, you can run the Electron application:

Using yarn: yarn dev
using npm: npm run dev
## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.
## License
This project is licensed under the MIT License.

- ## Arduino Code

```cpp
#include <ArduinoJson.h>

const int buttonPin1 = 2; // Digital pin for button 1
const int buttonPin2 = 3; // Digital pin for button 2
const int buttonPin3 = 4; // Digital pin for button 3
const int buttonPin4 = 5; // Digital pin for button 4
const int buttonPin5 = 6; // Digital pin for button 5

StaticJsonDocument<300> jsonDocument;
String previousState; // Variable to store the previous button state

void setup() {
  pinMode(buttonPin1, INPUT_PULLUP); // Set button 1 pin as input with internal pull-up
  pinMode(buttonPin2, INPUT_PULLUP); // Set button 2 pin as input with internal pull-up
  pinMode(buttonPin3, INPUT_PULLUP); // Set button 3 pin as input with internal pull-up
  pinMode(buttonPin4, INPUT_PULLUP); // Set button 4 pin as input with internal pull-up
  pinMode(buttonPin5, INPUT_PULLUP); // Set button 5 pin as input with internal pull-up

  Serial.begin(9600); // Initialize serial communication

  // Initialize the previous state with the initial state
  previousState = getButtonStates();
}

void loop() {
  // Read the button states
  String currentState = getButtonStates();

  // Check if the button states have changed
  if (currentState != previousState) {
    // Update the previous state
    previousState = currentState;

    // Clear the JSON document
    jsonDocument.clear();

    // Populate the JSON document with button states
    jsonDocument["btns"] = currentState;

    // Serialize the JSON document to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);

    // Send the JSON string over the serial port
    Serial.println(jsonString);
  }

  delay(100); // Add a small delay if needed
}

String getButtonStates() {
  // Read the button states
  int buttonState1 = digitalRead(buttonPin1);
  int buttonState2 = digitalRead(buttonPin2);
  int buttonState3 = digitalRead(buttonPin3);
  int buttonState4 = digitalRead(buttonPin4);
  int buttonState5 = digitalRead(buttonPin5);

  // Convert the button states to a binary string
  String binaryString = String(!buttonState1) + String(!buttonState2) + String(!buttonState3) +
                        String(!buttonState4) + String(!buttonState5);

  return binaryString;
}
