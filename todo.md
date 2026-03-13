# FreshPro — Task Tracker

## 1. Login Page

- [*] Check where email/password credentials are currently stored in the system
- [*] Implement a mock login for demo purposes (accept any credentials / dummy login)

---

## 2. Factory Setup Pages

### Page 1 — Basic Info
- [ ] Factory type selector: allow selection of **beef / chicken / fish / pork**
- [ ] Factory location field: integrate with **Google Maps**
- [ ] Restrict the Google Maps picker to **Thailand only**

### Page 2 — Personnel
- [ ] Factory manager: change input from full name → **username** (system username)
- [ ] Add employee: change full name field → **username** (system username)
- [ ] Add employee: **remove the department field**

### Page 3 — Suppliers
- [ ] **Remove** the "select raw material supplier" page
  - Reason: supplier selection is not fixed and is already available in the Dashboard

### Page 4 — Data Import
- [ ] **Remove** the data import page entirely

---

## 3. Dashboard

### 3.1 Overview Dashboard
- [ ] *(TBD)*

### 3.2 Sourcing (จัดหาวัตถุดิบ)
- [ ] **AI Assistant** — connect AI to the sourcing UI; when a message is submitted, AI returns the **top 3 best-matched supplier choices**
- [ ] Expand mock supplier list to **~10 suppliers**
- [ ] Supplier detail view — after selecting a supplier, show: location, meat types sold, price per kg
- [ ] **Generate PO** from the selected supplier
- [ ] After receiving a supplier invoice, record it to the dashboard as a **sub-page under Sourcing** (flow continues into Intake)

### 3.3 Intake (รับเข้าวัตถุดิบ)
- [ ] *(details TBD — source notes incomplete)*

### 3.4 Production Control (ควบคุมการผลิต)
- [ ] *(TBD)*

### 3.5 Quality Control (ตรวจสอบคุณภาพ)
- [ ] *(TBD)*

### 3.6 Warehouse (คลังสินค้า)
- [ ] *(TBD)*

### 3.7 Sales & Distribution (ฟีเจอร์ขายและจัดส่ง)
- [ ] *(TBD)*

---

## 4. Landing Page

- [ ] *(TBD)*

---

## 5. General

- [ ] **System preview animation** on the Landing Page
  - Scrolling SVG animation showcasing the full workflow: sourcing → intake → production → QC → warehouse → distribution
  - Auto-plays continuously (horizontal scroll / carousel style)
  - Navigation dots/buttons at the bottom for manual control
  - Reference the slide deck shared for animation content details
