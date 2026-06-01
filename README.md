# Greenhouse Management Backend

A backend system for managing greenhouse environments, built with Node.js, Express, and Prisma ORM.

## 🚀 Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL / MySQL (Update this based on your setup)
- **Language:** JavaScript / TypeScript

## 🛠️ Installation & Setup

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository

```bash
git clone [https://github.com/KinMiu/backend-Greenhouse-management.git](https://github.com/KinMiu/backend-Greenhouse-management.git)
cd backend-Greenhouse-management
```

### 2. Install Dependencies

```Bash
npm install
```

### 3. Environment Configuration

Create a .env file in the root directory (you can refer to .env.example).

Update the DATABASE_URL with your local database credentials:

Cuplikan kode
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mydb?schema=public"

### 4. Database Setup (Prisma)

Generate the Prisma client and run migrations to sync your database schema:

```Bash
npx prisma generate
npx prisma migrate dev --name init
🏃 Running the Application
To start the server in development mode:
```

```Bash
npm run dev
Or run it normally using node:
```

```Bash
node index.js
```

📂 Project Structure
src/: Contains the main application logic (controllers, routes, etc.).

prisma/: Contains the database schema and migration history.

index.js: The main entry point of the application.

.env.example: A template for required environment variables.

Developed by KinMiu

### Quick Instructions:

1. Open your project folder in VS Code.
2. Create a file named `README.md`.
3. Paste the code above into the file.
4. Save and push to your GitHub:
   ```bash
   git add README.md
   git commit -m "docs: add README in English"
   git push origin master
   ```
