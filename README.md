# 🚀 SprintFlow — Project Management & Collaboration Platform

![License](https://img.shields.io/badge/license-MIT-green)
![Tech Stack](https://img.shields.io/badge/stack-MERN-blue)
![Clean Architecture](https://img.shields.io/badge/architecture-clean-orange)
![WebSocket](https://img.shields.io/badge/realtime-Socket.IO-purple)

A modern **project management tool** inspired by [Plane.so](https://plane.so) — but with **real-time chat**, **video conferencing**, and **organization-based collaboration**.  
Built with **MERN Stack** and **Clean Architecture**, designed for **scalability** and **role-based access control**.

---

## 📌 Features

- 🏢 **Organization-based Workspaces**  
  Create and manage multiple organizations, each with its own projects, members, and permissions.

- 📂 **Project & Module Management**  
  - Create, edit, delete projects
  - Organize work into modules and tasks
  - Assign members and track progress

- ✅ **Role-Based Access Control (RBAC)**  
  - **Admin** — Full control over organization and projects  
  - **Member** — Create issues, join discussions  
  - **Custom Roles** — Extendable for future needs

- 💬 **Real-Time Chat** (per organization/project)  
  - Instant messaging with Socket.IO  
  - Infinite scroll & lazy loading for older messages

- 🎥 **Video Conferencing** *(planned)*  
  - Group calls for project meetings

- 📊 **Task Management**  
  - Kanban board with drag & drop (dnd-kit)  
  - Real-time task state updates

- 🔐 **Authentication & Security**  
  - Email & password login with verification  
  - Google & GitHub OAuth  
  - JWT-based authentication with refresh tokens

---

## 🛠 Tech Stack

**Frontend**
- ⚛ React (TypeScript)  
- 🎨 Tailwind CSS (custom components)  
- 📦 Redux Toolkit (state management)  
- 📡 Axios (API calls)  

**Backend**
- 🟢 Node.js + Express  
- 🗄 MongoDB + Prisma ORM  
- 🧹 Clean Architecture + SOLID Principles  
- 🔌 Socket.IO (real-time communication)  
- 📧 Nodemailer (email verification)

---
