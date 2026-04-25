🐟 FishTrack – Recreational Fishing Management Platform

FishTrack is a web-based platform designed to connect fishing pond administrators with recreational anglers. The application provides a centralized environment where users can explore fishing locations, access updated information, and share their fishing experiences.

 Features
👤 For Users (Fishermen)
Interactive map to discover fishing ponds
Advanced filtering (location, fish species, price, rating)
Detailed pond information (rules, prices, fish types, updates)
Ability to submit fishing reports (captures, photos, observations)
Rating and reviewing ponds
🛠️ For Administrators
Add, edit, and delete fishing ponds
Manage pond details (rules, pricing, species)
Publish updates (e.g., fish stocking events)
Moderate user-submitted reports
 System Features
Secure authentication using JWT
RESTful API for communication between frontend and backend
Integration with map services (Leaflet / Google Maps)
Structured relational database for storing users, ponds, reports, and ratings
 Architecture

The application follows a client-server architecture:

Frontend: React + Vite (TypeScript)
Backend: Node.js + Express (REST API)
Database: SQLite (with optional PostgreSQL support)
Maps Integration: Leaflet.js / Google Maps API
 Data Model

Main entities:

Users
Ponds
Reports
Updates
Ratings

Relationships:

Users can submit multiple reports and ratings
Each pond can have multiple reports, updates, and ratings
 Motivation

FishTrack was built to simplify the interaction between anglers and fishing pond administrators by offering real-time information, user-generated content, and an intuitive map-based interface.

🌐 Future Improvements
Real-time notifications for updates
Mobile app version
Social features (following users, sharing reports)
Advanced analytics for administrators
