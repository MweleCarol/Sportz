import AgentAPI from "apminsight";
AgentAPI.config();

import express from "express";
import { matchRouter } from "./Routes/matchesRoute.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./Config/arcjet.js";
import http from "http";
import { commentaryRouter } from "./Routes/commentaryRoute.js";

const app = express();
const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

/**
 * Wrapping the app in native Node js Http server
 * allowing both standard HTTP traffic
 * and WebSocket traffic to be handled by the same server instance.
 */

const server = http.createServer(app);

/**
 * This ensures  malicious traffic  , bots or rate-limited-users are rejected before the server
 * responds to the request, thus saving resources and improving overall security.
 */

app.use(securityMiddleware());
app.use(express.json());

app.use("/matches", matchRouter);
app.use("/matches/:id/commentary", commentaryRouter);

const { broadcastMatchCreated, broadcastCommentary } =
  attachWebSocketServer(server);
/*
  This handles dependency injection
  This allows  route handlers to  trigger real time socket updates without 
  having to manually  import  or reinitialize 
  WebSocket logic inside every route file 

   */
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running on ${baseUrl}`);
  console.log(
    `WebSocket Server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
