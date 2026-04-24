import http from "http";

const server = http.createServer((req, res) => {
  res.end("hello");
});

server.listen(3000, () => console.log("OK pe 3000"));