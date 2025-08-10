# 📋 Task Manager - Checksheet

A **dynamic, responsive, and real-time check sheet management system** designed for industrial use.  
It supports multiple forms, structured data storage, and an approval workflow with secure login for approvers.

## 🚀 Features
- **Dynamic Form Rendering** – Forms are generated from `config.json` with structured `header_id`, `line_id`, and `field_id`.
- **Multi-Form Support** – Easily manage multiple check sheets without modifying the core system.
- **Database Integration** – MySQL tables for:
  - `submission` → form submission metadata
  - `formdata` → individual field values
  - `frontend` → form structure (headers & lines)
- **Approval Workflow** – Public submission, approver-only approval access via session-based login.
- **Prefilled View Mode** – View submitted forms in readonly mode.
- **Responsive UI** – Works seamlessly on mobile, tablet, and desktop.

## ⚙️ Workflow
1. **Render Form** – Frontend fetches `config.json` → dynamically generates form.
2. **Submit** – Data stored in MySQL (`submission` & `formdata`), structure in `frontend`.
3. **Approve** – Approver logs in → views & approves with remarks.
4. **View** – Opens forms with submitted data in readonly mode.

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: Session-based login

---
