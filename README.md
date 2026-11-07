# Rentora – Property Rental Platform

Rentora is a modern property rental platform that connects tenants with property owners. It simplifies property discovery, booking management, and rental interactions through a secure and user-friendly experience.

## Live Demo

- **Live Website:** https://rentora-client-two.vercel.app/
- **Backend API:** https://rentora-server-gilt.vercel.app

## Key Features

- Browse and explore available rental properties.
- Search and discover properties by location and type.
- View detailed property information.
- Secure authentication with Google OAuth.
- Role-based dashboards for tenants, owners, and administrators.
- Submit and manage property booking requests.
- Add properties to favorites.
- Submit reviews and ratings for eligible properties.
- Manage bookings and payment transactions.
- Responsive design for desktop, tablet, and mobile devices.

## Technology Stack

**Frontend**
- Next.js
- React
- JavaScript
- Tailwind CSS
- Framer Motion
- Better Auth

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT
- JOSE

**Tools & Deployment**
- Git & GitHub
- Vercel
- MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- MongoDB database

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Frontend Setup

```bash
cd rentora-client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5005
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Start the frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:3000`

### 3. Backend Setup

```bash
cd rentora-server
npm install
```

Create a `.env` file:

```env
PORT=5005
MONGODB_URI=your-mongodb-connection-string
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm start
```

Backend URL: `http://localhost:5005`

## Project Structure

```text
rentora/
├── rentora-client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── next.config.js
│
├── rentora-server/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Authentication & Security

- Better Auth for user authentication.
- Google OAuth integration.
- JWT-based API authentication.
- Bearer token verification.
- Role-based access control.
- Protected backend routes.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL |
| `BETTER_AUTH_URL` | Better Auth URL |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `MONGODB_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend URL for backend authentication |
| `PORT` | Backend server port |

**Security Note:** Never expose secret credentials or commit `.env` files to GitHub.

## Deployment

Rentora is deployed using Vercel.

- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

## Author

**MD. ABU BAKKAR SIDDIK**

- **Role:** Frontend / MERN Stack Developer
- **Location:** Rangpur, Bangladesh
- **GitHub:** [GitHub Profile](https://github.com/abubakkarsiddik123)
- **LinkedIn:** [LinkedIn Profile](https://www.linkedin.com/in/abubakkarsiddik07/)

## License

This project is developed for educational and portfolio purposes.

---

**Rentora — Making Property Rental Simple and Convenient.**