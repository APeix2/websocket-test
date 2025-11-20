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
  messModel = {
    user: "websocket",
    text: "已開啟連線",
  };
  ws.send(JSON.stringify(messModel));

  // 歷史訊息傳給剛連上的 client
  messages.forEach((message) => ws.send(message));

  ws.on("close", () => {
    console.log("[Client disconnected]");
  });

  ws.on("message", (rawMessage) => {
    const message = rawMessage.toString(); // 保險一點轉字串

    messages.push(message);
    // ✅ 廣播給所有 client（包含自己）
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // 如果你想：只回給「其他人」，不要回給自己，就改成：
    // wss.clients.forEach(client => {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(message)
    //   }
    // })
  });
});
