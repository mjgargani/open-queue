![20250116_105052](https://github.com/user-attachments/assets/7f8ff09f-63ea-407f-84a8-871928f26ae9)

# Queue Management System

A robust queue management system built with Next.js and Redis. It provides real-time updates, audio feedback, and a user-friendly interface for administrators and clients to manage and view the queue.

## Project Structure

The project consists of the following key components:

### Pages
- **`/manage`**: Allows queue operators to manage the queue, call the next number, cancel ongoing calls, and view the current state of the queue.
- **`/queue`**: Displays the queue information for clients, including the latest call, ongoing calls, and the next number to be served.

### API Endpoints
- **`/api/manage`**: Handles queue management actions such as `call-next` and `undo` operations.
- **`/api/queue`**: Provides data for the queue, including the current state, finalized numbers, and the remaining queue.

### Utilities
- **`/lib/redis.ts`**: Configures the Redis connection and ensures queue initialization based on the environment variables `QUEUE_START` and `QUEUE_END`.
- **`/lib/fetchQueue.ts`**: Fetches queue data from the `/api/queue` endpoint.
- **`/types.ts`**: Contains TypeScript type definitions for `CurrentState` and `QueueResponse`.

## Features

- **Real-time Updates**: The `/queue` and `/manage` pages are synchronized with Redis data, providing real-time updates.
- **Audio Feedback**: Plays a notification sound on the `/queue` page when a new number is called.
- **Dynamic Initialization**: The queue is dynamically populated based on the environment variables `QUEUE_START` and `QUEUE_END`.
- **User-Friendly Interface**: Clear and intuitive UI for both operators and clients.
- **Error Handling**: Graceful handling of API errors and invalid actions.

## Environment Variables

The following environment variables must be configured:
- `REDIS_HOST`: The Redis server hostname (default: `localhost`).
- `REDIS_PORT`: The Redis server port (default: `6379`).
- `QUEUE_START`: The starting number of the queue (default: `1`).
- `QUEUE_END`: The ending number of the queue (default: `10000`).

## Installation and Usage

### Prerequisites
- Docker and Docker Compose
- Node.js and npm/yarn (for local development)

### Run project
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run prod
   ```
4. Access the application at `http://localhost:80`.

### Production
1. Start the application using Docker Compose:
   ```bash
   npm run docker:start
   ```
2. Reset the Redis database and initialize the queue:
   ```bash
   npm run docker:reset:redis
   ```

## Possible Improvements (WIP)

- **Testing**: Add unit tests and end-to-end tests to ensure the application behaves as expected.
- **Accessibility**: Improve accessibility features for better inclusivity.
- **Error Notifications**: Introduce visual feedback for errors on the UI.
- **Scalability**: Optimize Redis usage for larger-scale deployments.
- **Localization**: Support multiple languages for a broader audience.
- **Theming**: Allow customization of the UI theme for different use cases.
