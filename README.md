# 💼 Project Cost Tracker 

[Live Link](https://project-cost-estimater.onrender.com)

A responsive web application for managing project-related expenses. Built with React, Firebase, and Chakra UI. Users can sign up, log in, and track their project costs with real-time updates.

## 🚀 Features

### 🔐 User Authentication

- Firebase Authentication (Email/Password & Google Sign-in)
- Only authenticated users can access their data

### 💾 Firebase Firestore Integration

- Each user has their own collection of project items and other costs
- Data structure:
  - `/users/{userId}/items/{itemId}`
    - `name`: "Monitor"
    - `cost`: 250
  - `/users/{userId}/otherCosts/{costId}`
    - `description`: "Shipping"
    - `amount`: 50

### ➕ Add / Edit / Delete Functionality

- Add, edit, and delete **Project Items** (name and cost)
- Add, edit, and delete **Other Costs** (description and amount)
- Input validation for non-empty names/descriptions and positive values

### 💰 Real-Time Total Cost Display

- Dynamically updates the total cost based on current data

## 🛠️ Tech Stack

| Feature          | Tech Stack         |
| ---------------- | ------------------ |
| Frontend         | React.js           |
| State Management | Redux Toolkit      |
| UI Components    | Chakra UI          |
| Authentication   | Firebase Auth      |
| Database         | Firebase Firestore |
| App Bundler      | Vite               |
| Optional Hosting | Vercel / Netlify   |

## 🧠 Redux State Management

| Slice             | Purpose                         |
| ----------------- | ------------------------------- |
| `authSlice`       | Manages login/logout states     |
| `itemsSlice`      | Manages project items           |
| `otherCostsSlice` | Manages additional cost entries |

Uses Redux Thunks for async Firebase operations.

## 🖼️ UI/UX

- Built using Chakra UI components
- Responsive layout across devices
- Toast notifications for feedback on actions

## 📦 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint the codebase
```

## 🧩 Future Enhancements

These are planned features for future releases:

- ✅ **Filtering & Sorting** — by cost, date, etc.
- ✅ **Timestamps** — show when entries were added or modified
- ✅ **Visual Summaries** — pie/bar charts for cost distribution
- ✅ **Offline Support** — sync with localStorage

## 🔐 Security Rules

Ensure that Firebase security rules are set up to allow access **only** to a user's own documents.

## 👤 Author

**Vinay Kumar Reddy**

- MERN Stack Developer
- [LinkedIn](https://in.linkedin.com/in/vinay-kumar-reddy-mangalampenta-7590001b6)
- [GitHub](https://github.com/vinayKumarReddy-mangalampenta)



