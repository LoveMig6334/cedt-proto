# FreshPro — Task Tracker

## 1. Login Page

- [*] Check where email/password credentials are currently stored in the system
- [*] Implement a mock login for demo purposes (accept any credentials / dummy login)

---

## 2. Factory Setup Pages

### Page 1 — Basic Info

- [*] Factory type selector: allow selection of **beef / chicken / fish / pork**
- [*] Factory location field: integrate with **Google Maps**
- [*] Restrict the Google Maps picker to **Thailand only**

### Page 2 — Personnel

- [ ] Factory manager: change input from full name → **username** (system username)
- [ ] Add employee: change full name field → **username** (system username)
- [ ] Add employee: **remove the department field**

### Page 3 — Suppliers

- [*] **Remove** the "select raw material supplier" page
  - Reason: supplier selection is not fixed and is already available in the Dashboard

### Page 4 — Data Import

- [*] **Remove** the data import page entirely

---

## 3. Dashboard

### 3.1 Overview Dashboard

- [ ] _(TBD)_

### 3.2 Sourcing (จัดหาวัตถุดิบ)

- [ ] **AI Assistant** — connect AI to the sourcing UI; when a message is submitted, AI returns the **top 3 best-matched supplier choices**
- [ ] Expand mock supplier list to **~10 suppliers**
- [ ] Supplier detail view — after selecting a supplier, show: location, meat types sold, price per kg
- [ ] **Generate PO** from the selected supplier
- [ ] After receiving a supplier invoice, record it to the dashboard as a **sub-page under Sourcing** (flow continues into Intake)

### 3.3 Intake (รับเข้าวัตถุดิบ)

- [ ] After invoice is confirmed (from Sourcing flow), show a **pending row** in the intake history table with expected delivery date + notify employees
- [ ] **Remove** the "Quick Intake Record" side page
- [ ] On delivery date/time, show a button for employees to open the **"Record Intake" page** and upload a confirmation photo
- [ ] Recorded data should be analyzable as **daily / weekly / monthly / yearly** purchase summaries
- [ ] Add **mockup data** for daily, weekly, monthly, and yearly views

### 3.4 Production Control (ควบคุมการผลิต)

- [ ] Rename button **"+ เริ่มสายการผลิต"** → **"+ เพิ่มสายการผลิต"**
- [ ] Remove the **"เบิกวัตถุดิบ"** button from the "วัตถุดิบคงเหลือ" section — that section should only display real-time remaining raw materials
- [ ] "เพิ่มสายการผลิต" opens a **"ตั้งค่าการผลิต"** page where users requisition stock from inventory to the production line; requisition data must sync in real-time with the intake page status
- [ ] After creating a production line, users can click in to **update its progression** by entering output product details (e.g., ribeye steak Xkg, tenderloin steak Ykg…)
- [ ] System **calculates waste** and displays a **production efficiency summary** for each line

### 3.5 Quality Control (ตรวจสอบคุณภาพ)

- [ ] Remove **"moisture"** and **"fat marbling"** from the AI indicator fields
- [ ] Mock up **"+ สแกนล็อตใหม่"** feature:
  - Clicking opens a window to select a finished-product lot to scan
  - App navigates to `/qc` and plays an animation of meat pieces being AI-scanned one by one
  - Each scanned piece is recorded in a table with columns: lot ID, product name (matching meat type e.g. tenderloin), grade, score, status
  - AI QC processes **one lot at a time** only
- [ ] Completed lots move to a new **History page** (build new); all data is stored for long-term quality analysis

### 3.6 Warehouse (คลังสินค้า)

- [ ] _(TBD)_

### 3.7 Sales & Distribution (ฟีเจอร์ขายและจัดส่ง)

- [ ] _(TBD)_

---

## 4. Landing Page

- [ ] _(TBD)_

---

## 5. General

- [ ] **System preview animation** on the Landing Page
  - Scrolling SVG animation showcasing the full workflow: sourcing → intake → production → QC → warehouse → distribution
  - Auto-plays continuously (horizontal scroll / carousel style)
  - Navigation dots/buttons at the bottom for manual control
  - Reference the slide deck shared for animation content details
