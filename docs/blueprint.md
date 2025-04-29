# **App Name**: SAT Prep Adaptive Tool (SPAT)

## Core Features:

- User Authentication: User authentication and profile management using Firebase Authentication, with support for free, premium, and high-end subscription tiers.
- Adaptive SAT Test Module: SAT practice test interface with adaptive testing engine.  Difficulty adjusts based on performance. Support full-length mock tests and focused practice.
- Content Delivery: Display detailed explanations for practice test questions, with access controlled by subscription tier.
- Results & Basic Analytics: Automatic scoring upon test completion and results summary page identifying areas for improvement.

## Style Guidelines:

- Primary color: White or light gray for a clean and modern look.
- Secondary color: Soft blue (#3498db) to align with Apple's design aesthetic.
- Accent: Green (#2ecc71) for positive feedback and success indicators.
- Clean and readable sans-serif font.
- Use simple, outlined icons for navigation and features.
- Ensure a responsive layout that adapts to different screen sizes.
- Subtle transitions and animations to enhance user experience.

## Original User Request:
Objective: Build a Minimum Viable Product (MVP) for a web application called "SATIL", designed as an adaptive SAT preparation platform.

Target Audience: Vietnamese high school students preparing for the SAT exam.

Platform: Web Application, to be developed and hosted using Firebase services.

Core Technologies:

Development Environment: Firebase Studio (Project IDX)
Backend Services: Utilize Firebase Authentication, Firestore (or Realtime Database), Cloud Functions (Node.js for custom logic if needed), and Firebase Hosting.
Frontend: Use a modern web framework template available within Firebase Studio (e.g., React, Vue, Angular, or Flutter Web) suitable for building a clean, responsive UI.
Key Features to Implement:

User Authentication:

Implement user registration and login functionality using Firebase Authentication.
Manage basic user profiles and track subscription status (Free, Premium, High-End).
SAT Test Module:

Create an interface for users to take SAT practice tests.
Support full-length mock tests and practice modes focused on specific sections (Reading, Writing & Language, Math).
Adaptive Testing Engine: Implement logic where the difficulty of subsequent questions adjusts based on the user's performance on previous questions within a module.
Question Bank: Set up Firestore/Database schema to store a large bank of SAT questions (~20 full tests initially). Questions should be categorized by section, topic, and difficulty level. Include storage for correct answers and detailed explanations.
Test Administration: Backend logic (Cloud Functions if needed) to serve questions, manage test sessions (timing), and record user answers.
Content Delivery:

Display specialized training materials (e.g., study guides, tips focusing on digital SAT/Bluebook strategies). Structure access based on subscription tiers.
Provide detailed explanations for practice test questions, with access controlled by subscription tier.
Results & Basic Analytics:

Implement automatic scoring upon test completion.
Display a results summary page showing the user's score.
Provide basic analysis identifying potential areas needing improvement.
Monetization (Freemium Model):

Free Tier:
Limit: 1 practice test per day.
Access: View ~50% of question explanations and ~50% of training materials.
Premium Tier (~100,000 VND/month target price point):
Limit: Up to 100 practice tests per day.
Access: Full access to all question explanations and all training materials.
High-End Tier (~300,000 VND/month target price point):
Includes all Premium features.
Personalized Study Path: Implement the basic framework for this feature, which will analyze performance data and suggest a tailored study roadmap (full implementation might be post-MVP). Placeholder for future virtual tutor feature.
Integrate a payment gateway stub/placeholder for future integration (e.g., Stripe).
UI/UX Design Principles:

Design a clean, minimalist, and intuitive user interface, taking inspiration from Apple's design philosophy.
Ensure the web application is responsive and works well across different screen sizes (desktop, tablet).
Deployment:

Configure the project for deployment to Firebase Hosting.
Generate basic automated deployment scripts compatible with Firebase Studio/CLI.
Initial Content Load:

Structure the database to accommodate the initial 20 SAT practice tests and the specialized training materials. (Actual content population may occur separately).
Goal for this Generation: Create the foundational structure, core features (authentication, basic testing, results display), tier structure, and deployment setup for the SATIL web application MVP.
  