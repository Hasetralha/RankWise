# RankWise

RankWise is a modern SEO analysis and optimization tool built with Next.js, Express, and MongoDB.

## Project Structure

The project is split into two main parts:

### Backend (`/backend`)
- Express.js server with TypeScript
- MongoDB database integration
- Authentication with JWT
- Stripe payment integration
- Mailgun email service
- SEO analysis endpoints

### Frontend (`/frontend`)
- Next.js with TypeScript
- NextAuth.js for authentication
- Tailwind CSS for styling
- Stripe checkout integration
- Responsive dashboard

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Stripe account
- Mailgun account
- GitHub OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rankwise.git
cd rankwise
```

2. Install backend dependencies:
```bash
cd backend
npm install
cp .env.example .env # Then edit .env with your credentials
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
cp .env.example .env # Then edit .env with your credentials
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:5000.

## Features

- User authentication with GitHub OAuth
- Subscription management with Stripe
- SEO analysis tools
- Meta tag generation
- Website analysis
- Email notifications
- Responsive dashboard

## Environment Variables

### Backend (.env)
```
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PRICE_ID=your_stripe_price_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
