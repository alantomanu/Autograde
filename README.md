<div align="center">

<h1 align="center">📚 Autograde </h1>

<br>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-000?style=for-the-badge&logo=vercel&logoColor=white)](https://autograde-teacher.vercel.app/)
&nbsp;&nbsp;
[![License](https://img.shields.io/badge/📜_MIT_License-000?style=for-the-badge)](LICENSE)
&nbsp;&nbsp;
[![Next.js](https://img.shields.io/badge/⚡_Powered_by_Next.js-000?style=for-the-badge&logo=next.js)](https://nextjs.org/)

</div>

<p align="center">
  <a href="https://autograde-teacher.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Site-AutoGrade-blueviolet?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Site Badge"/>
  </a>
</p>

<p align="center">
  🔗 Visit the full application here: <br>
  <a href="https://autograde-teacher.vercel.app/" target="_blank"><strong>https://autograde-teacher.vercel.app/</strong></a>
</p>

---

<p align="center">
<strong>AI-Powered Descriptive Answer Sheet Grading</strong><br>
Automate handwritten answer sheet checking with <strong>Meta-LLaMA</strong>.<br>
Save hours of manual work and boost grading accuracy.
</p>

<div align="center">

**🌟 Features That Transform Teacher Workflows**

<table>
  <tr>
    <td>📤</td>
    <td><strong>Answer Sheet Upload</strong><br>Upload student PDFs and answer keys easily</td>
  </tr>
  <tr>
    <td>🧠</td>
    <td><strong>Intelligent OCR & Evaluation</strong><br>Auto digitize handwriting and compare with answer keys using LLMs</td>
  </tr>
  <tr>
    <td>✅</td>
    <td><strong>Teacher Review & Override</strong><br>Manually check, edit, or approve final scores</td>
  </tr>
  <tr>
    <td>📊</td>
    <td><strong>Dynamic Reports & Exports</strong><br>Download question-wise Excel reports instantly</td>
  </tr>
  <tr>
    <td>📈</td>
    <td><strong>Real-Time Processing Insights</strong><br>Monitor progress and evaluation status live</td>
  </tr>
</table>

</div>

---

<div align="center">

## 📸 Project Screenshots

</div>

### 🏠 Home Page 
<!-- Add your actual screenshots below -->
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c2e23c14-aaa9-41d0-895d-41f1ef447596" />

---

### 📤 Answer Sheet Upload & Processing  
<img width="1920" height="1080" alt="Screenshot 2025-06-25 100941" src="https://github.com/user-attachments/assets/3d991b90-a47a-4cd7-aa40-b03cb6ebe8c4" />
<img width="1920" height="1080" alt="Screenshot 2025-06-25 103942" src="https://github.com/user-attachments/assets/8a0b1de0-8344-4af4-be05-3e7ec571de5c" />

<img width="1920" height="1080" alt="Screenshot 2025-06-25 103952" src="https://github.com/user-attachments/assets/2ecca3f9-05db-4513-b211-a309e535c095" />


---

### 📊 Reports & Analytics  
<img width="1920" height="1080" alt="Screenshot 2025-06-25 104054" src="https://github.com/user-attachments/assets/771cdf43-e03e-4366-99aa-7733d986dd33" />


---

<div align="center">


## 🛠️ Tech Stack


| Category       | Technology | Purpose |
|----------------|------------|---------|
| **Framework**  | ![Next.js](https://img.icons8.com/?size=20&id=MWiBjkuHeMVq&format=png) **Next.js 14** | Full-stack React framework |
| **Backend**    | ![Node.js](https://img.icons8.com/?size=20&id=54087&format=png) **Node.js 20+** | Server-side APIs & processing |
| **LLM**  | 🧠 **Meta-LLaMA 3.2 Vision, 3.3 Instruct** | Handwriting recognition & semantic answer evaluation |
| **Styling**    | ![Tailwind](https://img.icons8.com/?size=20&id=4PiNHtUJVbLs&format=png) **Tailwind CSS**, **shadcn/ui** | Modern responsive UI |
| **Database**   | ![PostgreSQL](https://img.icons8.com/?size=20&id=38561&format=png) **PostgreSQL (Neon Serverless)** | Store results & users |
| **ORM**        | ![Drizzle](https://img.icons8.com/?size=20&id=13014&format=png) **Drizzle ORM** | Type-safe DB queries |
| **Caching**      | ![Redis](https://img.icons8.com/?size=20&id=33039&format=png) **Upstash Redis** | Cache uploaded Answer keys for fast reuse |
| **Storage**    | ![Cloudinary](https://img.icons8.com/ios-filled/20/FFFFFF/cloud.png) **Cloudinary** | Store scanned answer sheets & keys securely |
| **Hosting**    | ![Vercel](https://img.icons8.com/ios-filled/20/FFFFFF/vercel.png) **Vercel**, 🚉 **Railway**, ☁️ **Koyeb**, 🚀 **Render** | Deploy frontend & backend |
| **DevOps**     | ![Docker](https://img.icons8.com/?size=20&id=38555&format=png) **Docker**,**GitHub Actions** | CI/CD pipeline & containerization |

</div>

---

## 🚀 Quick Start Guide

### 1. Clone & Setup

```bash
git clone https://github.com/alantomanu/Autograde.git
cd Autograde
npm install
````

### 2. Configure Environment

Create `.env.local` and add:

```env
#Cloudinary (for storing answer sheet images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

#Google OAuth (for teacher login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

#NextAuth (for secure authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_nextauth_secret

#Neon Serverless PostgreSQL (for storing user & results data)
DATABASE_URL="postgresql://your_db_user:your_db_password@your_neon_host/your_db_name?sslmode=require"

#Upstash Redis (for caching answer keys & sessions)
UPSTASH_REDIS_REST_URL=https://your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

#API Base URL (for connecting frontend to backend services)
NEXT_PUBLIC_API_BASE_URL=https://your_api_base_url

```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to get started.

---

## 🤝 Contribute to AutoGrade

We welcome contributions! Here’s how you can help:

1. 🐞 **Report Bugs** — Open an issue with clear steps
2. ✨ **Suggest Features** — Share ideas to make it better
3. 🔥 **Submit Pull Requests** — Fork, make changes, and PR!

---

## 📬 Contact

Questions or ideas? Reach out anytime:
📧 [alantomanu501@gmail.com](mailto:alantomanu501@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ by the AutoGrade Team | © 2025 AutoGrade</sub>
</div>

