# แผนการทดสอบระบบ BMI Web Application (Testing Plan)

เอกสารนี้รวบรวมแผนการทดสอบและวิธีการรัน Test สำหรับโปรเจกต์ BMI Web Application โดยเน้นที่การทดสอบแบบ End-to-End (E2E) เพื่อจำลองการใช้งานจริงของผู้ใช้ตั้งแต่ต้นจนจบ

## 1. เครื่องมือที่ใช้ (Tools)
*   **Framework**: [Playwright](https://playwright.dev/)
*   **Type**: End-to-End (E2E) Testing
*   **Browser**: Chromium (Desktop Chrome)
*   **Environment**: Localhost (Next.js Dev Server)

## 2. การเตรียมสภาพแวดล้อม (Prerequisites)
ก่อนเริ่มการทดสอบ ต้องตรวจสอบว่าติดตั้ง dependencies และตั้งค่า database เรียบร้อยแล้ว:

1.  ติดตั้ง Dependencies:
    ```bash
    npm install
    npx playwright install --with-deps
    ```
2.  ตั้งค่า Environment Variables (`.env.local`):
    *   ต้องมี `POSTGRES_URL` ที่เชื่อมต่อกับ Database ได้จริง

## 3. กรณีทดสอบ (Test Cases)
การทดสอบจะรันแบบ **Serial** (ตามลำดับ) เพื่อจำลอง Flow การใช้งานจริงของผู้ใช้คนหนึ่ง:

| Case ID | ชื่อการทดสอบ | รายละเอียด (Description) | สิ่งที่คาดหวัง (Expected Result) |
| :--- | :--- | :--- | :--- |
| **TC-01** | **Register** | สมัครสมาชิกใหม่โดยใช้ Username/Password ที่ไม่ซ้ำ | ระบบพาไปหน้า Login (`/login`) |
| **TC-02** | **Login** | เข้าสู่ระบบด้วย User ที่เพิ่งสมัคร | ระบบพาไปหน้า Dashboard (`/dashboard`) |
| **TC-03** | **Calculate BMI** | กรอกน้ำหนัก (70kg) และส่วนสูง (175cm) แล้วกดคำนวณ | แสดงค่า BMI (22.86) และผลแปลความหมาย (Normal weight) |
| **TC-04** | **Check History** | รีเฟรชหน้า Dashboard เพื่อดูตารางประวัติ | ตารางแสดงข้อมูลล่าสุด (70.00 kg, 22.86) |
| **TC-05** | **Logout** | กดปุ่ม Logout ที่ Navbar | ระบบลบ Session และพาผู้ใช้กลับหน้า Login |
| **TC-06** | **Register Duplicate** | สมัครสมาชิกซ้ำด้วย Username เดิมที่มีในระบบ | แสดงข้อความ "Username already exists" และไม่ไปหน้า Login |
| **TC-07** | **Login Wrong Password** | เข้าสู่ระบบด้วย Password ที่ผิด | แสดงข้อความ Error และยังคงอยู่หน้า Login |
| **TC-08** | **Login Invalid User** | เข้าสู่ระบบด้วย Username ที่ไม่มีจริง | แสดงข้อความ Error และยังคงอยู่หน้า Login |

## 4. วิธีการรัน Test (Execution)

### รัน Test ทั้งหมด (Headless Mode)
คำสั่งนี้จะรัน test ทุกไฟล์ (`tests/*.spec.ts`) ใน background:
```bash
npx playwright test
```

### รัน Test แบบเห็นหน้าจอ (UI Mode)
หากต้องการดูการทำงานของ Browser ขณะรัน test:
```bash
npx playwright test --ui
```

### ดูรายงานผลการทดสอบ (Report)
หลังจากรัน test เสร็จสิ้น สามารถเปิดดู HTML Report ได้ด้วยคำสั่ง:
```bash
npx playwright show-report
```

## 5. โครงสร้างไฟล์ Test
*   **`tests/bmi-e2e.spec.ts`**: ไฟล์หลักเก็บ Test Cases การใช้งานปกติ (Happy Path)
*   **`tests/bmi-error-handling.spec.ts`**: ไฟล์เก็บ Test Cases กรณีเกิดข้อผิดพลาด (Negative Tests)
*   **`playwright.config.ts`**: ไฟล์ตั้งค่า Playwright

---
*Last Updated: 2026-01-20*