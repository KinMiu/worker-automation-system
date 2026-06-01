# 1. Gunakan Node.js v22 berbasis Alpine agar ukurannya super ringan
FROM node:22-alpine

# 2. Tentukan folder kerja di dalam container
WORKDIR /app

# 3. Copy file package untuk instalasi dependensi
COPY package*.json ./

# 4. Install dependensi (termasuk Prisma)
RUN npm install

# 5. Copy seluruh sisa file project Anda ke dalam container
COPY . .

# 6. Generate Prisma Client di dalam container agar sesuai arsitektur Linux Alpine
RUN npx prisma generate

# 7. Expose port backend Anda (misal port 5000, sesuaikan dengan port backend Anda)
EXPOSE 3001

# 8. Command untuk menjalankan backend
CMD ["npm", "run", "start"]