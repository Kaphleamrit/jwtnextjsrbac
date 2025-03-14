
# 🚀 Next.js + Prisma Authentication Project

This is a **role-based authentication system** built with **Next.js**, **Prisma**, **JWT authentication**, and **cookies for session management**. 

## ✅ Features
- 🔐 **User Authentication** (Register & Login with password hashing)
- 🍪 **Session Management** (JWT stored in HTTP-only cookies)
- 🔒 **Role-Based Access Control (RBAC)** (Admin/User)
- 🚫 **Protected API Routes** (Only admins can access certain features)
- 🎭 **Users can only update their own profiles**
- 🗑️ **Admins can manage and delete users**
- 🌍 **Full-Stack Next.js Implementation**

---

## 📦 **Installation & Setup**

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Setup Environment Variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mydb"
SECRET_KEY="yourSuperSecretJWTKey"
```

> ⚠️ **Replace `USER`, `PASSWORD`, and `mydb` with your actual PostgreSQL database credentials.**

### 4️⃣ **Setup Prisma Database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ **Run the Development Server**
```bash
npm run dev
```

Your app should be running at **[http://localhost:3000](http://localhost:3000)**.

---

## 📂 **Project Structure**
```
/my-repo
│── prisma/             # Prisma schema & migrations
│── public/             # Static assets
│── app/                # Next.js App Router
│   │── actions.ts      # Server actions (authentication & database operations)
│   │── page.tsx        # Main UI (Home, Login, Register, Logout)
│── lib/                # Utility files (e.g., Prisma client)
│── .env                # Environment variables (ignored in Git)
│── .gitignore          # Files & folders to ignore in Git
│── README.md           # Project Documentation
│── package.json        # Dependencies & scripts
```

---

## 📜 **Usage Guide**
### 🔹 **Register a New User**
- Visit the **home page** and sign up.
- Select **User** or **Admin** role.
- Click **Register**.

### 🔹 **Login**
- Enter your email & password.
- Click **Login**.
- If successful, a session cookie is set.

### 🔹 **Admin Features**
- If logged in as an **admin**, you can **see all users**.
- Admins can **delete users**.

### 🔹 **Logout**
- Click **Logout** to clear session cookies.

---

## 🛠️ **Technology Stack**
| Tech      | Description |
|-----------|------------|
| **Next.js** | React-based framework for server & client components |
| **Prisma**  | ORM for database queries |
| **JWT** | Secure authentication tokens |
| **Cookies** | Secure session management |
| **bcryptjs** | Password hashing |
| **PostgreSQL** | Database |

---

## 🎯 **Future Enhancements**
- 🔹 **React Context API for Authentication State**
- 🔹 **Role-based Protected Routes**
- 🔹 **Deploy to Vercel**
- 🔹 **Email Verification**


## ⚖️ **License**
This project is **open-source** under the **MIT License**.

---

