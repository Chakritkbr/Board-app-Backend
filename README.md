
# Board_app_backend

## ขั้นตอนการติดตั้ง

1. **ติดตั้ง Dependencies**: เริ่มต้นด้วยการติดตั้งไลบรารีที่จำเป็นทั้งหมด โดยรันคำสั่งต่อไปนี้ในโฟลเดอร์โปรเจค:

   ```bash
   npm install
   ```

2. **สร้างไฟล์ .env**: สร้างไฟล์ `.env` ที่รากโปรเจคและกำหนดค่าต่างๆ ตามต้องการ เช่น:

   ```plaintext
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=your_database
   JWT_SECRET=your_jwt_secret
   ```

3. **ติดตั้งและกำหนดค่า Docker**
   - ใช้ไฟล์ `docker-compose.yml` ดังต่อไปนี้:
     ```yaml
     version: '3.8'

     services:
       db:
         image: mysql:8.0
         container_name: mysql
         environment:
           MYSQL_ROOT_PASSWORD: boardTest
           MYSQL_DATABASE: boardTest
           MYSQL_USER: adminBoardTest
           MYSQL_PASSWORD: BoardTest1234
         ports:
           - '3306:3306'
         volumes:
           - db_data:/var/lib/mysql
         networks:
           - my_network

       phpmyadmin:
         image: phpmyadmin/phpmyadmin
         container_name: phpmyadmin
         environment:
           PMA_HOST: db
           PMA_USER: adminBoardTest
           PMA_PASSWORD: BoardTest1234
         ports:
           - '8080:80'
         depends_on:
           - db
         networks:
           - my_network

     volumes:
       db_data:

     networks:
       my_network:
     ```
   - รันคำสั่งต่อไปนี้เพื่อเริ่มต้น Docker:
     ```bash
     docker-compose up -d
     ```


4. **รันแอปพลิเคชัน**: ใช้คำสั่งด้านล่างเพื่อเริ่มแอปพลิเคชันในโหมดพัฒนา:

   ```bash
   npm run start:dev
   ```

## ภาพรวมการออกแบบของ Application Architecture

Applicationนี้ ประกอบด้วย Controller, Service, และ Repository ที่ทำงานร่วมกันเพื่อให้บริการต่างๆ ของ Board App

- **Post Module**: จัดการการCRUD ของโพสท์
- **Comment Module**: จัดการการCRUD ของคอมเมนต์
- **User Module**: จัดการ Create user และ login 
- **Authentication Module**: จัดการการเข้าถึง API ด้วย JWT และทำ strategy สำหรับ Authorize user 

## รายการ Libraries/Packages ที่ใช้พร้อมคำอธิบาย

- **@nestjs/common**: ไลบรารีหลักของ NestJS สำหรับการสร้างโมดูล, คอนโทรลเลอร์ และบริการ
- **@nestjs/config**: ช่วยในการจัดการการตั้งค่าจากไฟล์ `.env`
- **@nestjs/typeorm**: ใช้ในการเชื่อมต่อกับฐานข้อมูลโดยใช้ TypeORM
- **class-validator**: ใช้สำหรับการตรวจสอบข้อมูลที่ส่งเข้ามา
- **jsonwebtoken**: ใช้สำหรับสร้างและตรวจสอบ JSON Web Tokens
- **jest**: ไลบรารีสำหรับการทดสอบยูนิต

## วิธีการรัน Unit Test

คุณสามารถรันการทดสอบยูนิตได้โดยใช้คำสั่ง:

```bash
npm run test
```

หากต้องการรันการทดสอบในโหมดติดตามการเปลี่ยนแปลงให้ใช้คำสั่ง:

```bash
npm run test:watch
```

หรือหากต้องการตรวจสอบความครอบคลุมของการทดสอบให้ใช้:

```bash
npm run test:cov
```

