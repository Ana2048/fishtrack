# 🐟 FishTrack

### *Recreational Fishing Management Platform*

---

## 🌊 Overview

**FishTrack** is a full-stack web application designed to connect fishing pond administrators with recreational anglers through a simple, interactive, and map-based platform.

The application allows users to explore fishing locations, access real-time information, and share their fishing experiences, while administrators can manage ponds, updates, and user-generated content.

---

## ✨ Key Features

### 🎣 For Fishermen

* Explore fishing ponds on an **interactive map**
* Filter ponds by **location, species, price, and rating**
* View detailed information (rules, updates, fish types)
* Submit **fishing reports** (captures, photos, observations)
* Rate and review fishing ponds

### 🛠️ For Administrators

* Add, edit, and manage fishing ponds
* Publish updates (e.g. fish stocking events)
* Manage fishing rules and information
* Moderate user-submitted reports

---

## 🧠 Core Functionality

* Secure **authentication system using JWT**
* **RESTful API** for client-server communication
* Real-time interaction between users and administrators
* Integration with **Leaflet / Google Maps** for geolocation

---

## 🏗️ Architecture

The application follows a **client-server architecture**:

Frontend (React)
↓
Backend (Node.js / Express)
↓
Database (SQLite)
↘
Maps API (Leaflet / Google Maps)

---

## 🧩 Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React + Vite (TypeScript)    |
| Backend  | Node.js + Express            |
| Database | SQLite                       |
| Auth     | JWT (JSON Web Token)         |
| Maps     | Leaflet.js / Google Maps API |

---

## 🗄️ Data Model

Main entities:

* Users
* Ponds
* Reports
* Updates
* Ratings

Relationships:

* A user can submit multiple reports and ratings
* A pond can have multiple reports, updates, and ratings

---

## 📸 Screenshots

Below are some example views of the application:

* 🗺️ **Main Map View** – interactive map with fishing locations
 <img width="1488" height="907" alt="image" src="https://github.com/user-attachments/assets/20212f48-93f0-4e47-924a-4a37a84d7150" />

* 📄 **Pond Details Page** – rules, pricing, updates, and ratings
  <img width="1265" height="503" alt="image" src="https://github.com/user-attachments/assets/e3856d87-8eca-4f79-b91c-9ce2fc551ccf" />

---

## 💡 Motivation

FishTrack was created to simplify how anglers discover fishing locations and to improve communication between users and pond administrators through real-time, user-generated content.

---

## 🚀 Future Improvements

* Notifications for updates and reports
* Mobile version of the application
* Social features (profiles, followers, activity feed)
* Advanced analytics for administrators

---

## 👩‍💻 Author

**Păștin Ana-Letiția**
Technical University of Cluj-Napoca
