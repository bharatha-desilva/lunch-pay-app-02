# LunchPay - Expense Splitting Application

A modern web application for splitting expenses with friends, family, and colleagues. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Group Management**: Create and manage expense-sharing groups
- **Expense Tracking**: Add and categorize expenses with flexible splitting options
- **Balance Calculation**: Real-time balance tracking and debt management
- **Settlement Recording**: Record payments and settle debts
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## 🏃‍♂️ Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd lunch-pay-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
# Copy from env.example
cp env.example .env

# Edit the .env file with your configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=LunchPay
VITE_APP_VERSION=1.0.0
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── groups/         # Group management components
│   ├── expenses/       # Expense-related components
│   ├── balances/       # Balance display components
│   ├── shared/         # Shared/common components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🌐 API Integration

The application uses a generic API service layer that supports any REST API backend. The API service automatically handles:

- Authentication tokens
- Request/response formatting
- Error handling
- Loading states

### API Endpoints Expected

The application expects the following REST API endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh

#### Users
- `GET /users` - List users
- `GET /users/{id}` - Get user details
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

#### Groups
- `GET /groups` - List user's groups
- `GET /groups/{id}` - Get group details
- `POST /groups` - Create group
- `PUT /groups/{id}` - Update group
- `DELETE /groups/{id}` - Delete group
- `POST /groups/{id}/members` - Add member to group

#### Expenses
- `GET /expenses` - List expenses (with filters)
- `GET /expenses/{id}` - Get expense details
- `POST /expenses` - Create expense
- `PUT /expenses/{id}` - Update expense
- `DELETE /expenses/{id}` - Delete expense

#### Additional Endpoints
- `GET /groups/{id}/balances` - Get group balances
- `POST /settlements` - Create settlement
- `GET /categories` - Get expense categories

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Environment Variables for Production

Set these environment variables in your deployment platform:

```
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=LunchPay
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing

The project includes setup for testing with Jest and React Testing Library. To run tests:

```bash
npm test
```

## 🔒 Security

- JWT tokens are stored in localStorage
- All API requests include authentication headers
- Input validation using Zod schemas
- XSS protection through React's built-in protections

## 🎨 Customization

### Styling

The application uses Tailwind CSS with a custom design system. Colors and styling can be customized in:

- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - CSS custom properties and global styles

### Components

UI components are built following the shadcn/ui pattern and can be easily customized or replaced.

## 📱 Progressive Web App (PWA)

The application is PWA-ready. To enable PWA features:

1. Add a web app manifest
2. Implement service workers
3. Add offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**
   - Run `npm run type-check` to see detailed type errors
   - Ensure all dependencies are properly installed

2. **API requests fail**
   - Check that `VITE_API_BASE_URL` is correctly set
   - Verify the backend API is running and accessible

3. **Styles not loading**
   - Ensure Tailwind CSS is properly configured
   - Check that PostCSS is processing the CSS files

4. **Authentication issues**
   - Clear localStorage and try logging in again
   - Check browser network tab for API response errors

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the documentation above
- Ensure you're using the correct Node.js version (see `.nvmrc`)

## 🏗️ Development Roadmap

- [x] MVP Core Features (Authentication, Groups, Basic Expenses)
- [ ] Advanced Splitting (Unequal splits, percentages)
- [ ] Settlement System
- [ ] Expense Categories and Search
- [ ] Mobile Application
- [ ] Real-time Notifications
- [ ] Advanced Analytics
- [ ] Multi-currency Support

---

Built with ❤️ for the developer community