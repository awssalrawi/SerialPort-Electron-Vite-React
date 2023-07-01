import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import path from "node:path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SerialPort } = require("serialport");
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

async function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  try {
    const ports = await SerialPort.list();
    console.log("SerialPort.list()", ports);

    // Check if any ports are available
    if (ports.length === 0) {
      console.error("No serial ports found.");
      return;
    }

    // Use the first available port
    const portPath = ports[0].path;
    const port = new SerialPort({
      path: portPath,
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      bufferSize: 2048,
    });

    // Read data from the serial port
    // port.on("data", (data) => {
    //   console.log("Received data:", data.toString());
    // });

    // Write data to the serial port
    port.write("Hello, Arduino!", (err: Error) => {
      if (err) {
        console.error("Error writing to serial port:", err);
      }
    });

    port.on("data", (data: Buffer) => {
      console.log("Received data:", data.toString());
      // Send the data to the renderer process
      win.webContents.send("serial-data", data.toString());
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

app.on("window-all-closed", () => {
  win = null;
});

// app.whenReady().then(createWindow);

//*******************Modified */
app.whenReady().then(() => {
  createWindow();

  // Serial port communication
});
