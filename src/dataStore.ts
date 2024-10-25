import http from "http";
import PhotoModel, { Photo } from "./models/photo.model";
import { PaginatedResult } from "./interfaces";

import connectDB from "./database";
connectDB();

const fetchData = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    http.get("http://jsonplaceholder.typicode.com/photos", (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", async () => {
        try {
          const photos: Photo[] = JSON.parse(data);
          for (const photo of photos) {
            const result = await PhotoModel.updateOne(
              { id: photo.id },
              { $set: photo },
              { upsert: true }
            );

            if (result.upsertedCount > 0) {
              console.log(`Inserted new document with id: ${photo.id}`);
            } else {
              console.log(`Updated existing document with id: ${photo.id}`);
            }
          }
          console.log("Data has been fetched and stored in MongoDB");
          resolve();
        } catch (error) {
          console.error("Error parsing or saving data:", error);
          reject(error);
        }
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

/**
 * Returns paginated data with optional sorting.
 * @param page - The current page number
 * @param limit - The number of items per page
 * @param orderBy - The field to order by
 * @param order - The order direction ('asc' or 'desc')
 * @returns PaginatedResult<Photo>
 */

export const getPaginatedData = async (
  page: number = 1,
  limit: number = 10,
  orderBy: keyof Photo = "id",
  order: "asc" | "desc" = "asc"
): Promise<PaginatedResult<Photo>> => {
  const sortOption = order === "asc" ? 1 : -1;

  const totalItems = await PhotoModel.countDocuments();

  const data = await PhotoModel.find()
    .sort({ [orderBy]: sortOption })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const totalPages = Math.ceil(totalItems / limit);

  return {
    current_page: page,
    data,
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
