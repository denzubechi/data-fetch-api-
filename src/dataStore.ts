import http from "http";
import { Photo, PaginatedResult } from "./interfaces";

let memoryStore: Map<number, Photo> = new Map();

const fetchData = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    http.get("http://jsonplaceholder.typicode.com/photos", (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const photos: Photo[] = JSON.parse(data);
        photos.forEach((photo) => {
          if (!memoryStore.has(photo.id)) memoryStore.set(photo.id, photo);
        });
        console.log(
          `Memory store updated with ${memoryStore.size} unique items.`
        );
        resolve();
      });

      res.on("error", (err) => {
        console.error("Error fetching data:", err);
        reject(err);
      });
    });
  });
};

setInterval(fetchData, 60000);
fetchData();

export const getPaginatedData = (
  page: number = 1,
  limit: number = 10,
  orderBy: keyof Photo = "id",
  order: "asc" | "desc" = "asc"
): PaginatedResult<Photo> => {
  const dataArray = Array.from(memoryStore.values());
  const totalItems = dataArray.length;
  const totalPages = Math.ceil(totalItems / limit);

  dataArray.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const startIndex = (page - 1) * limit;
  const paginatedData = dataArray.slice(startIndex, startIndex + limit);

  return {
    current_page: page,
    data: paginatedData,
    total_items: totalItems,
    total_pages: totalPages,
    first_page_url: `/api/photos?page=1&limit=${limit}&orderBy=${orderBy}&order=${order}`,
    last_page_url: `/api/photos?page=${totalPages}&limit=${limit}&orderBy=${orderBy}&order=${order}`,
    next_page_url:
      page < totalPages
        ? `/api/photos?page=${
            page + 1
          }&limit=${limit}&orderBy=${orderBy}&order=${order}`
        : null,
    prev_page_url:
      page > 1
        ? `/api/photos?page=${
            page - 1
          }&limit=${limit}&orderBy=${orderBy}&order=${order}`
        : null,
  };
};
