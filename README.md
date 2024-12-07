# Notes manager Project with Nest.js, React, and Tailwind CSS

This is a project for a note manager that uses **Nest.js**, **React**, **Tailwind CSS**, and **TypeScript** to build an interactive single page application website. The site includes functionalities like a creating a note, categories, and editing them.

## Requirements

Before installing the project, make sure you have the following tools installed on your machine:

- **Nest.js**  - [Download Nest.js](https://nodejs.org/en)
- **npm** (Node.js package manager) - Usually installed along with Node.js.
- **PostgreSQL**
- **Vite** (optional, if you want to use Vite instead of `create-next-app`) - [Install Vite](https://vitejs.dev/)

## Setting Up PostgreSQL for Notes App

Follow these steps to set up PostgreSQL for your Notes app.

### 1. Install PostgreSQL

If you don't have PostgreSQL installed, you can install it on your Linux machine by running:

```bash
# On Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# On Fedora
sudo dnf install postgresql-server postgresql-contrib

# On MacOS (using Homebrew)
brew install postgresql
```
If you're on Windows, you can download the installer from: https://www.postgresql.org/download/windows/
### 2. Set up the database
Make sure to create a database for the project in postgresql, then create a .env file in the root of your project with the info of your postgresql:
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres or the name of your user
DATABASE_PASSWORD=your_password
DATABASE_NAME=notas_db or the name of your db with permits

```

## Installation

### Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/ensolvers-github-challenges/Quiroga-e96e60.git
cd this-repository
```
## Install Dependencies

### Dependencies for frontend
```bash

cd Quiroga-e96e60\frontend

npm install
```

### Dependencies for backend
```bash

cd Quiroga-e96e60\backend

npm install
```

## Tailwind CSS

Make sure the configuration files are properly set up. You should have the following configuration files in the root of your project:

- tailwind.config.js: Config for custom styles.
- postcss.config.js: Config for PostCSS and autoprefixer.

## Running the Project

### Start the server
Once the dependencies are installed, you can run the development server in the backend folder with the following command:
```bash
cd Quiroga-e96e60\backend
npm run start
```
This will start the development server at http://localhost:3000.

### Start react
Run the development server for react in the frontend folder with the following command:
```bash
cd Quiroga-e96e60\frontend
npm run dev
```



