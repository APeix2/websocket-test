const express = require("express");
const WebSocket = require("ws");

const PORT = 1234;
const server = express().listen(PORT, () =>
  console.log(`[Server] Listening on http://localhost:${PORT}`)
);

const messages = [];
const wss = new WebSocket.Server({ server });

let messModel = {
  user: "",
  text: "",
};

wss.on("connection", (ws) => {
  console.log("[Client connected]");
  // 連線成功回傳訊息
  messModel = {
    user: "websocket",
    text: "已開啟連線",
  };
  ws.send(JSON.stringify(messModel));

  // 歷史訊息傳給剛連上的 client
  messages.forEach((message) => ws.send(message));
  // client 離線
  ws.on("close", () => {
    console.log("[Client disconnected]");
  });

  // 接收 client 發來的訊息
  ws.on("message", (rawMessage) => {
    const message = rawMessage.toString();
    messages.push(message);
    // 廣播給所有 client（包含自己）
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
