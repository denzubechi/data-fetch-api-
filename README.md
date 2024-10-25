# Express TypeScript Pagination API

This project is a Node.js server built with **Express** and **TypeScript**. It periodically fetches data from an external API, stores unique items in an in-memory data store, and provides an endpoint to serve this data with pagination capabilities.

## Features

- Periodic data fetching from `https://jsonplaceholder.typicode.com/photos` every minute.
- In-memory storage to ensure no duplicate items are stored.
- Manual pagination implementation without any external libraries.
- TypeScript interfaces to ensure type safety.
- API endpoint to retrieve paginated data in a structured format.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Implementation Details](#implementation-details)

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/denzubechi/data-fetch-api-.git
   cd data-fetch-api
   npm install
   ```

## Usage

The server periodically fetches data and makes it accessible through an API endpoint.

## Project Structure

/data-fetch-api ├── src │ ├── interfaces.ts # TypeScript interfaces for types │ ├── server.ts # Main server code │ ├── dataStore.ts # Data storage and fetching logic ├── tsconfig.json └── package.json

## API Endpoints

- **GET** `/api/photos`
  - **Description**: Retrieves paginated data from the in-memory data store.
  - **Query Parameters**:
    - `page` (optional): The page number to retrieve (default is `1`).
    - `perPage` (optional): The number of items per page (default is `10`).

## Implementation Details

### Data Fetching and Storage

1. **Data Fetching**: The server fetches data every 1 minute from `https://jsonplaceholder.typicode.com/photos`.
2. **Deduplication**: The data is stored in a `Map` (in-memory store) to ensure no duplicate items are saved.
3. **Pagination**: The `getPaginatedData` function slices the data array to return a specific range of items based on the `page` and `perPage` query parameters.

## Example Full Request

To retrieve paginated data from the API, you can make a request like this:

### Using cURL

````bash
curl "http://localhost:3000/api/photos?page=1&limit=5&orderBy=title&order=desc"

## Example Response with easeir navigation

```json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "accusamus beatae ad facilis cum similique qui sunt",
        "url": "https://via.placeholder.com/600/92c952",
        "thumbnailUrl": "https://via.placeholder.com/150/92c952"
      }
    ],
    "total_items": 1000,
    "total_pages": 200,
    "first_page_url": "/api/photos?page=1&limit=5&orderBy=title&order=desc",
    "last_page_url": "/api/photos?page=200&limit=5&orderBy=title&order=desc",
    "next_page_url": "/api/photos?page=2&limit=5&orderBy=title&order=desc",
    "prev_page_url": null
  }
}
````
