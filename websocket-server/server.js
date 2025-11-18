const express = require('express')
const WebSocket = require('ws')

// 指定一個 port
const PORT = 1234

// 建立 express 物件並用來監聽 PORT
const server = express()
    .listen(PORT, () => console.log(`[Server] Listening on http://localhost:${PORT}`))

// 建立 WebSocket 服務
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
    console.log('[Client connected]')

    ws.on('close', () => {
        console.log('[Client disconnected]')
    })

    ws.on('message', message => {
        console.log(`[Received] ${message}`);
        ws.send(JSON.stringify(`Echo: ${message}`));
    })


})
