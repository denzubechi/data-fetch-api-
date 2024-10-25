import http from "http";
import url from "url";
import { getPaginatedData } from "./dataStore";
import { ApiResponse, Photo } from "./interfaces";

const PORT = 3000;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url as string, true);

  if (reqUrl.pathname === "/api/photos" && req.method === "GET") {
    const query = reqUrl.query;
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const orderBy = (query.orderBy as keyof Photo) || "id";
    const order = (query.order as "asc" | "desc") || "asc";

    const paginatedResult = getPaginatedData(page, limit, orderBy, order);

    const response: ApiResponse<Photo> = {
      status: "success",
      message: "Data retrieved successfully",
      data: paginatedResult,
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: "Route Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
