# 🌍 AFIYAPAL – An AI-powered public health intelligence and healthcare education platform

AFIYAPAL is an AI-powered health assistant designed to improve access to basic healthcare guidance, health education, mental wellness support, and doctor connections for African communities.

The platform combines AI, multilingual support, health content, and telemedicine workflows to help users receive first-step health guidance in a simple, accessible, and familiar way.

---

## ✨ Inspiration

Accessing quality healthcare in many African communities remains a challenge due to limited medical infrastructure, long travel distances, language barriers, cost constraints, and low access to reliable health information.

We created **AFIYAPAL** to make healthcare more accessible, inclusive, and smarter using AI-powered assistance and low-barrier digital communication tools.

By integrating technologies like **Gemini AI**, multilingual support, and telemedicine workflows, AFIYAPAL aims to bridge the gap between healthcare providers and people who need timely health guidance — in their own language and through familiar digital channels.

---

## ⚙️ What AFIYAPAL Does

### 🏥 AI Symptom Checker

Users can describe their symptoms and receive AI-powered health insights. The symptom checker helps users understand possible next steps and whether they may need professional medical attention.

> AFIYAPAL does not replace a licensed medical professional. It provides first-step guidance and encourages users to seek professional care when needed.

### 💬 Multilingual Health Support

AFIYAPAL supports communication in:

- English
- Swahili

This helps make health guidance more inclusive and easier to understand for users across different communities.

### 🧠 Mental Health Companion

The mental health companion provides supportive wellness prompts, mindfulness tips, emotional check-ins, and safe guidance for users who may need mental health support.

High-risk interactions can be flagged for safety review and escalation where appropriate.

### 👨‍⚕️ Telemedicine Connector

AFIYAPAL helps users connect with verified healthcare providers through consultation request workflows.

Users can request medical help, and admins can assign verified doctors based on urgency, specialty, language, and availability.

### 📚 Health Education Content

The platform includes health articles and educational resources covering topics such as:

- Malaria
- Maternal health
- Nutrition
- Mental health
- First aid
- General wellness

Content can be reviewed before publishing to ensure quality and trustworthiness.

---

## 🔧 How We Built It

AFIYAPAL was built as a modern web platform using a scalable full-stack architecture.

### Frontend

The user interface is built with **Next.js**, providing a fast, responsive, and accessible experience for users and administrators.

Key frontend areas include:

- Public homepage
- Authentication pages
- AI chatbot interface
- Blog and health education pages
- Admin dashboard
- Doctor verification workflows
- Consultation management screens
- Safety and reporting dashboards

### Backend

The backend uses server-side logic and database-backed workflows to manage users, doctors, AI logs, consultations, reports, notifications, and admin actions.

Core backend responsibilities include:

- Authentication and sessions
- Role-based access control
- Admin permissions
- Symptom checker logging
- AI safety flagging
- Doctor verification
- Consultation request management
- Reports and safety center
- Audit logging
- Notification workflows

### Database

AFIYAPAL uses **Prisma** as the database ORM, allowing structured management of platform data such as:

- Users
- Doctor profiles
- Symptom check logs
- Mental health interactions
- AI safety flags
- Consultation requests
- Blog articles
- Reports
- Audit logs
- Notifications
- Platform settings
- Health resources

### AI Integration

AFIYAPAL integrates with **Gemini AI** to power health-related conversations, symptom checking, and user support flows.

AI interactions are designed with safety in mind by including:

- Medical disclaimers
- Emergency guidance
- Risk-level detection
- Safety flags
- Human review workflows
- Privacy-conscious logging

---

## 🆘 Maternal Emergency Response

AFIYAPAL includes an **Emergency Help** feature for high-priority maternal and medical emergencies, designed for both anonymous and authenticated users.

### How it works

1. **Emergency Help button** — A prominent red button labelled "Emergency Help" that triggers a 3-second countdown to prevent false alarms. Placed on the dashboard and alongside the disclaimer in the chatbot UI.
2. **Phone + type selection** — After the countdown, the user enters their phone number (optional) and selects the emergency type:
   - **👶 Maternal Emergency** — alerts a maternal health specialist (default, pre-selected)
   - **🚑 Medical Emergency** — alerts the general medical response team
3. **Location capture** — The user's GPS coordinates are captured via `navigator.geolocation` and sent alongside the alert.
4. **Session-based identity** — Anonymous users get a `sessionId` (UUID stored in `localStorage`) so the emergency can be tracked without requiring login.
5. **API notification** — `POST /api/maternal/emergency/trigger` logs the alert and returns a confirmation. In production, this would notify admins and nearby facilities.

### Chatbot integration

- When an emergency is triggered, the chatbot automatically switches to **emergency guidance mode** — the system prompt changes to provide calming, step-by-step first-aid instructions.
- A red banner appears at the top of the chatbot UI indicating that emergency mode is active.
- Messages sent during emergency mode include an `emergency` flag in the API request body.

### Maternal keyword detection

- The chatbot detects maternal health keywords (pregnancy, contractions, bleeding, etc.) in user messages.
- On first detection, it asks: *"Save your emergency contact so we can reach you faster if needed."*
- The phone number is saved to `localStorage` under `afiyapal-maternal-contact` and can be used to pre-fill future emergency requests.

### Anonymous user flow

Since users can interact with the chatbot without signing in, the system uses:

- **`sessionId`** — generated on first visit, stored in `localStorage`
- **Coordinates** — captured at SOS trigger time
- **Phone** — optionally captured at SOS trigger or via maternal keyword prompt
- All three are sent with the emergency request, giving responders actionable data even for anonymous users.

---

## 🛡️ Safety and Privacy

Because AFIYAPAL handles health-related information, privacy and safety are central to the platform.

The system includes:

- Medical disclaimers across AI assistant flows
- Emergency guidance for critical symptoms
- Privacy-safe admin summaries
- Restricted access to sensitive health details
- Required reason before viewing sensitive summaries
- Audit logs for sensitive admin actions
- Role-based access control
- Doctor verification before public visibility
- Safety reports and review workflows

AFIYAPAL avoids exposing full sensitive health conversations by default. Admins see summaries first, and sensitive access is restricted to authorized roles such as Super Admins and Medical Reviewers.

---

## 🧑‍💼 Admin Dashboard

AFIYAPAL includes a powerful admin dashboard for managing platform trust, safety, and operations.

Admin modules include:

- Overview dashboard
- User management
- Doctor verification
- Symptom checker logs
- AI safety flags
- Mental health oversight
- Content management
- Consultation requests
- Reports and safety center
- Audit logs
- Platform settings
- Health resources
- Notifications
- Testing checklist

The admin dashboard helps the team ensure that the platform remains safe, medically responsible, and operationally reliable.

---

## 🔐 Role-Based Access

AFIYAPAL supports multiple roles for safe platform management:

- User
- Doctor
- Admin
- Super Admin
- Medical Reviewer
- Support Admin
- Doctor Manager
- Content Manager

Each role has specific permissions. For example:

- Super Admins can manage system-wide settings and audit logs.
- Doctor Managers can approve or reject doctors.
- Medical Reviewers can review AI safety flags.
- Content Managers can manage health articles.
- Support Admins can manage consultation requests and reports.

---

## 📌 Key Features

- AI-powered symptom checker
- English and Swahili support
- Mental health companion
- Verified doctor connection workflow
- Health education articles
- Admin dashboard
- Doctor verification
- Consultation request management
- AI safety flagging
- Reports and safety center
- Audit logs
- Notifications
- Health resource management
- Privacy-first safety review system

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file and configure your database and AI provider settings.

Example:

```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key"
SESSION_SECRET="your-secure-session-secret"
```

### 3. Push database schema

```bash
npx prisma db push
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Seed development data

```bash
npx prisma db seed
```

### 6. Run the development server

```bash
npm run dev
```

The app should now be available at:

```txt
http://localhost:3000
```

---

## 🧪 Testing

AFIYAPAL includes an admin testing checklist for verifying important platform behavior.

Important checks include:

- Normal users cannot access `/admin`
- Suspended users cannot use protected services
- Doctors do not appear publicly before verification
- Doctor Managers can approve doctors
- Content Managers cannot approve doctors
- Medical Reviewers can review AI safety flags
- Support Admins can manage consultation requests
- Critical AI flags appear in the admin dashboard
- Consultations can only be assigned to verified doctors
- Sensitive health details are not exposed unnecessarily
- Audit logs are created for sensitive actions

---

## 🧭 Project Vision

AFIYAPAL aims to become a trusted digital health access bridge for African communities.

The long-term vision is to support:

- AI-assisted health guidance
- Multilingual health conversations
- Low-tech access through SMS, WhatsApp, or USSD
- Verified doctor networks
- Localized health resources
- Preventive health education
- Mental health support
- Community-level health insights

---

## ⚠️ Medical Disclaimer

AFIYAPAL is not a replacement for professional medical diagnosis, treatment, or emergency care.

The AI assistant provides general health guidance only. Users should contact a qualified healthcare provider for medical advice and seek emergency services immediately when experiencing severe or life-threatening symptoms.

---

## 👥 Team

Built with the goal of making healthcare more accessible, inclusive, and intelligent for African lives.

---

## 📄 License

This project is intended for research, and healthcare innovation purposes.
