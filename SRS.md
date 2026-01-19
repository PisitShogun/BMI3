# Software Requirements Specification (SRS)
**Project Name:** BMI Tracking Web Application  
**Version:** 1.0  
**Date:** 2026-01-19  

## 1. บทนำ (Introduction)
เอกสารฉบับนี้จัดทำขึ้นเพื่อระบุความต้องการของระบบ (Software Requirements) สำหรับเว็บแอปพลิเคชันคำนวณและติดตามค่าดัชนีมวลกาย (BMI) รองรับผู้ใช้งานหลายคน (Multi-user) พร้อมระบบรายงานสารสนเทศเพื่อการจัดการ (MIS)

### 1.1 จุดประสงค์ (Purpose)
เพื่อพัฒนาระบบที่ช่วยให้ผู้ใช้งานแต่ละคนสามารถสมัครสมาชิก เข้าสู่ระบบ เพื่อคำนวณค่า BMI บันทึกข้อมูลส่วนตัว และดูรายงานสถิติย้อนหลังของตนเองเพื่อวิเคราะห์แนวโน้มสุขภาพได้

### 1.2 ขอบเขตของระบบ (Scope)
- รองรับการใช้งานหลายผู้ใช้ (Multi-user) ด้วยระบบสมาชิก
- คำนวณค่า BMI จากน้ำหนักและส่วนสูง
- บันทึกประวัติการคำนวณลงฐานข้อมูล (SQLite) แยกตามรายบุคคล
- แสดงรายงานสรุปภาพรวม (Dashboard) ของผู้ใช้งานแต่ละคน
- แสดงรายงานสถิติย้อนหลังตามช่วงเวลา (รายวัน, รายสัปดาห์, รายเดือน, รายปี)

## 2. ความต้องการทางฟังก์ชัน (Functional Requirements)

### 2.0 การจัดการผู้ใช้งาน (User Management)
- **FR-00-1**: ระบบต้องรองรับการสมัครสมาชิก (Register) ด้วย Username และ Password
- **FR-00-2**: ระบบต้องรองรับการเข้าสู่ระบบ (Login) และออกจากระบบ (Logout)
- **FR-00-3**: ข้อมูลการคำนวณและรายงานต้องแสดงเฉพาะข้อมูลของผู้ใช้งานที่ล็อกอินอยู่เท่านั้น (Data Isolation)

### 2.1 ระบบคำนวณ BMI (BMI Calculator)
- **FR-01**: ระบบต้องรับค่า "น้ำหนัก (กิโลกรัม)" และ "ส่วนสูง (เซนติเมตร)" จากผู้ใช้ได้
- **FR-02**: ระบบต้องคำนวณค่า BMI ตามสูตร  
  `BMI = น้ำหนัก (kg) / (ส่วนสูง (m))^2`
- **FR-03**: ระบบต้องระบุเกณฑ์ BMI (Underweight, Normal, Overweight, Obesity) ตามค่าที่คำนวณได้
- **FR-04**: ระบบต้องแสดงผลลัพธ์การคำนวณทันทีบนหน้าจอ

### 2.2 การจัดการข้อมูล (Data Management)
- **FR-05**: เมื่อคำนวณเสร็จสิ้น ระบบต้องบันทึกข้อมูล (Weight, Height, BMI, Timestamp) ลงฐานข้อมูลอัตโนมัติ โดยผูกกับบัญชีผู้ใช้
- **FR-06**: ระบบต้องแสดงรายการประวัติการคำนวณล่าสุด (Recent Records) ของผู้ใช้นั้นๆ ได้

### 2.3 ระบบรายงาน MIS (MIS Reporting)
- **FR-07**: ระบบต้องมีหน้า Dashboard แสดงภาพรวม ได้แก่
  - จำนวนบันทึกทั้งหมด (Total Records)
  - ค่าเฉลี่ย BMI (Average BMI)
  - สัดส่วนตามเกณฑ์ (Distribution: Underweight, Normal, Overweight, Obesity)
- **FR-08**: ระบบต้องสามารถแสดงรายงานสถิติย้อนหลัง (Historical Stats) โดยแบ่งกลุ่มข้อมูลได้ดังนี้:
  - รายวัน (Daily)
  - รายสัปดาห์ (Weekly)
  - รายเดือน (Monthly)
  - รายปี (Yearly)
- **FR-09**: ในแต่ละช่วงเวลา ระบบต้องแสดงอย่างน้อย:
  - จำนวนรายการ (Count)
  - ค่าเฉลี่ย BMI (Average BMI)

## 3. ความต้องการที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements)

### 3.1 เทคโนโลยี (Technology Stack)
- **Frontend/Backend**: Next.js 16.1.3 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 19.2.3 (React Compiler Enabled)
- **Database**: SQLite (better-sqlite3)
- **Styling**: CSS Modules

### 3.2 ประสิทธิภาพ (Performance)
- การคำนวณและการบันทึกข้อมูลแต่ละครั้งควรใช้เวลาไม่เกิน 1 วินาทีบนเครื่องมาตรฐานของผู้ใช้
- การดึงข้อมูลรายงาน MIS (รวม/ย้อนหลัง) ควรตอบสนองได้ภายในเวลาที่ผู้ใช้รู้สึกว่าทันที (interactive)

### 3.3 ความน่าเชื่อถือ (Reliability)
- ข้อมูลต้องถูกบันทึกอย่างถูกต้องและไม่สูญหายภายใต้การใช้งานปกติ
- ใช้ฐานข้อมูลแบบ Local File (SQLite) ที่ง่ายต่อการสำรองและกู้คืนข้อมูล

### 3.4 การใช้งาน (Usability)
- UI ต้องใช้งานง่าย มีฟอร์มกรอกข้อมูลน้ำหนัก/ส่วนสูงอย่างชัดเจน
- ส่วนรายงาน MIS ต้องเปลี่ยนช่วงเวลาได้สะดวก เช่นผ่านปุ่มหรือแท็บ (Overview, Day, Week, Month, Year)

## 4. โครงสร้างฐานข้อมูล (Database Schema)

### Table: `users`
| Column Name | Type    | Description                                  |
|------------|---------|----------------------------------------------|
| `id`       | INTEGER | Primary Key, Auto Increment                  |
| `username` | TEXT    | ชื่อผู้ใช้งาน (Unique)                        |
| `password` | TEXT    | รหัสผ่าน (Hashed)                            |
| `created_at`| TEXT   | วันที่สมัครสมาชิก                             |

### Table: `records`
| Column Name | Type    | Description                                  |
|------------|---------|----------------------------------------------|
| `id`       | INTEGER | Primary Key, Auto Increment                  |
| `user_id`  | INTEGER | Foreign Key อ้างอิงตาราง `users`             |
| `weight`   | REAL    | น้ำหนัก (กิโลกรัม)                          |
| `height`   | REAL    | ส่วนสูง (เซนติเมตร)                         |
| `bmi`      | REAL    | ค่า BMI ที่คำนวณได้                         |
| `created_at` | TEXT  | วันที่และเวลาที่บันทึก (ISO 8601 string)   |

## 5. User Interface (UI) Design (High-level)

### 5.1 Main Page (BMI Calculator)
- ฟอร์มกรอกน้ำหนัก (kg) และส่วนสูง (cm)
- ปุ่มคำนวณ BMI
- แสดงผลลัพธ์ BMI และเกณฑ์ที่ตรงกับค่า BMI
- แสดงรายการประวัติล่าสุด (Recent Records) ด้านล่าง

### 5.2 MIS Report Page
- ส่วนหัวแสดงชื่อหน้า: MIS Report / Dashboard
- มีแท็บหรือปุ่มเลือกมุมมอง:
  - Overview
  - Daily
  - Weekly
  - Monthly
  - Yearly
- ในแต่ละมุมมองจะแสดง:
  - ตารางหรือรายการแสดงช่วงเวลา (period)
  - จำนวนรายการ (count)
  - ค่าเฉลี่ย BMI (avgBmi)