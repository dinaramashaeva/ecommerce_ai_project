# BuyWise — AI-Integrated E-Commerce Web Application

This project is a full-stack AI-powered e-commerce web application developed as part of the Final State Certification Project.

## Technologies Used

Frontend:
- React.js + Vite
- Redux Toolkit
- Tailwind CSS

Backend:
- Node.js
- Express.js
- PostgreSQL

AI Integration:
- Google Gemini (via OpenRouter)
- Multilingual search (English, Russian, Kyrgyz)

Other:
- Cloudinary (image storage)
- Nodemailer (email notifications)
- JWT Authentication

## Features

- User registration and authentication (JWT)
- Product listing, filtering and product details
- AI-powered multilingual product search
- Shopping cart functionality
- Order placement and management
- Product reviews (verified buyers only)
- Admin dashboard for product, order and user control
- REST API architecture

## Project Structure

/client → React frontend (port 5173)
/dashboard → Admin panel (port 5174)
/server → Node.js backend (port 4000)

## Installation

Clone repository:
git clone https://github.com/dinaramashaeva/ecommerce_ai_project

Install and run backend:
cd server
npm install
npm run dev

Install and run frontend:
cd client
npm install
npm run dev

Install and run dashboard:
cd dashboard
npm install
npm run dev


## Environment Variables

Create `config/config.env` in the server folder:
PORT=4000
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
JWT_SECRET_KEY=your_secret
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=your_openrouter_key
CLOUDINARY_CLIENT_NAME=your_cloudinary_name
CLOUDINARY_CLIENT_API=your_cloudinary_api
CLOUDINARY_CLIENT_SECRET=your_cloudinary_secret

## Author

Dinara Mashaeva  
Final State Certification Project