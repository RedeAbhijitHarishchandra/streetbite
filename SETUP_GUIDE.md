# 🥪 StreetBite: The Super Simple Setup Guide

This guide covers **everything** you need to run the project.

---

## ⚡ The "Cheat Sheet" (For the Pros)
*Just want the commands? Here is everything in order.*

### 1. Install Tools (Windows Powershell)
```powershell
# Install Git, Java 21, Node.js, and MySQL via command line
winget install -e --id Git.Git
winget install -e --id Oracle.JDK.21
winget install -e --id OpenJS.NodeJS.LTS
winget install -e --id Oracle.MySQL
# RESTART YOUR TERMINAL AFTER THIS!
```

### 2. Clone & Setup
```bash
# Clone the repo
git clone <your-repo-url>
cd StreetBite

# --- BACKEND ---
cd backend
# This command downloads ALL backend dependencies automatically and runs the server
./mvnw spring-boot:run
# (Keep this terminal open!)
```

```bash
# --- FRONTEND (New Terminal) ---
cd StreetBite/frontend
# This command downloads ALL frontend dependencies listed in package.json
npm install
# This runs the frontend
npm run dev
```

---

## 🐢 The "Step-by-Step" Guide (Teaching Mode)

Imagine this project is like a sandwich shop. We have the **Kitchen (Backend)** and the **Counter (Frontend)**.

### 📦 Step 1: Install the "Ingredients" (System Dependencies)

You need 4 main tools installed on your computer. You can download them manually OR use the commands below.

#### Option A: The Easy Way (Command Line)
Open **PowerShell** as Administrator and run these commands one by one:

1.  **Git** (To get the code):
    ```powershell
    winget install -e --id Git.Git
    ```
2.  **Java 21** (For the Backend/Kitchen):
    ```powershell
    winget install -e --id Oracle.JDK.21
    ```
3.  **Node.js** (For the Frontend/Counter):
    ```powershell
    winget install -e --id OpenJS.NodeJS.LTS
    ```
4.  **MySQL** (The Database/Fridge):
    ```powershell
    winget install -e --id Oracle.MySQL
    ```

*👉 **IMPORTANT:** Close your terminal and open a new one after installing these!*

---

### 🍳 Step 2: Start the Kitchen (Backend)

The Backend handles the data. It needs to download its own special libraries (like Spring Boot).

1.  **Open a Terminal** and go to the backend folder:
    ```bash
    cd StreetBite/backend
    ```

2.  **Configure the Database Password**:
    *   Open `src/main/resources/application.properties`.
    *   Change `spring.datasource.password=${DB_PASSWORD}` to your actual MySQL password (e.g., `root`).

3.  **Run the Server (and install dependencies)**:
    *   Run this single command. It will **automatically download** all the Java libraries you need (this might take 5 minutes the first time).
    ```bash
    ./mvnw spring-boot:run
    ```
    *(If `./mvnw` doesn't work, try just `mvnw spring-boot:run`)*

    ✅ **Success:** You will see `Started StreetBiteApplication`. **Leave this window open.**

---

### 🏪 Step 3: Start the Counter (Frontend)

The Frontend is what you see. It has its own list of libraries (like React, Next.js, Framer Motion).

1.  **Open a NEW Terminal** and go to the frontend folder:
    ```bash
    cd StreetBite/frontend
    ```

2.  **Install Dependencies**:
    *   This command reads the `package.json` file and downloads everything listed there into a `node_modules` folder.
    ```bash
    npm install
    ```

3.  **Run the App**:
    ```bash
    npm run dev
    ```

    ✅ **Success:** It will say `Ready in ...`.

---

### 🚀 Step 4: Visit the Shop

Open your browser and go to:
👉 **http://localhost:3000**

---

### 📝 Summary of Commands Used

| Action | Command | What it does |
| :--- | :--- | :--- |
| **Install Java** | `winget install ...` | Installs the Java language. |
| **Install Node** | `winget install ...` | Installs the Node.js runtime. |
| **Clone** | `git clone ...` | Downloads the project code. |
| **Backend Libs** | `./mvnw ...` | Downloads Java dependencies (Maven). |
| **Run Backend** | `./mvnw spring-boot:run` | Starts the Spring Boot server. |
| **Frontend Libs** | `npm install` | Downloads JS dependencies (node_modules). |
| **Run Frontend** | `npm run dev` | Starts the Next.js server. |
