# 💰 Hisaab - Expense Sharing Made Simple

![Hisaab Logo](https://img.shields.io/badge/Hisaab-Expense%20Sharing-blue?style=for-the-badge&logo=calculator)
![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646cff?style=flat-square&logo=vite)

A modern, mobile-first expense sharing application built with React and TypeScript. Track, split, and settle expenses with friends, family, and groups effortlessly.

## 🌟 Features

### 💳 Expense Management
- **Add Expenses**: Create individual or group expenses with detailed information
- **Multiple Split Methods**: 
  - Split equally among participants
  - Exact amount splits
  - Percentage-based splits
  - Share-based splits
- **Multi-Currency Support**: USD, EUR, GBP, INR, LKR, SGD, JPY, and more
- **Receipt Upload**: Photo receipt support (placeholder functionality)
- **Expense Categories**: Organized spending tracking

### 👥 Group Management
- **Create Groups**: Set up different types of groups (Trip, Home, Couple, Other)
- **Multi-Member Support**: Add unlimited members to groups
- **Group-Specific Expenses**: Track expenses within specific groups
- **Group Analytics**: View spending patterns per group

### 💰 Balance & Settlement
- **Automatic Balance Calculation**: Smart debt calculation and simplification
- **Person-to-Person Balances**: Track individual debts
- **Group Balance Tracking**: Monitor group-wide financial status
- **Settlement Management**: Record and track payments between members

### 📊 Analytics & Reports
- **Spending Breakdown**: Visual charts by category
- **Monthly/Weekly Summaries**: Time-based expense analysis
- **Export Functionality**: CSV/PDF export capabilities
- **Interactive Charts**: Beautiful data visualizations

### 📱 User Experience
- **Mobile-First Design**: Optimized for mobile devices
- **Dark/Light Theme**: Automatic theme switching
- **Offline Capability**: Works without internet connection
- **Intuitive Navigation**: Bottom navigation for easy mobile use

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### State Management & Routing
- **React Router 6.26.2** - Client-side routing
- **React Query 5.56.2** - Server state management
- **Zustand 4.5.0** - Lightweight state management
- **React Hook Form 7.53.0** - Form handling

### UI/UX Libraries
- **Radix UI** - Headless UI components
- **Framer Motion 11.0.0** - Smooth animations
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sabiqsabry/Hisab.git
   cd Hisab
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
For testing purposes, you can use:
- **Email**: `test@hisaab.com`
- **Password**: `123456`

Or simply click "Skip Login (Demo Mode)" to explore the app without authentication.

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── MobileLayout.tsx # Mobile navigation layout
│   └── ThemeProvider.tsx # Theme management
├── pages/              # Application pages
│   ├── Dashboard.tsx   # Main dashboard
│   ├── AddExpense.tsx  # Expense creation
│   ├── Groups.tsx      # Group management
│   ├── Balances.tsx    # Balance calculations
│   ├── Analytics.tsx   # Charts and reports
│   ├── Login.tsx       # Authentication
│   └── Settings.tsx    # User preferences
├── lib/                # Utilities and data
│   ├── data.ts         # Sample data and functions
│   ├── utils.ts        # Utility functions
│   └── theme.ts        # Theme configuration
├── hooks/              # Custom React hooks
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: `#0A122A` (Dark Blue)
- **Secondary**: `White`
- **Background**: Light Gray
- **Accent**: Success/Error states

### Typography
- **Font**: Inter (Clean, modern sans-serif)
- **Responsive**: Mobile-first approach

### Components
- **Cards**: Clean, elevated containers
- **Buttons**: Consistent styling with hover states
- **Forms**: Accessible form components
- **Navigation**: Bottom navigation for mobile

## 📊 Data Structure

### Core Entities
- **Users**: Profile information and preferences
- **Groups**: Collection of users with shared expenses
- **Expenses**: Individual expense records with splits
- **Settlements**: Payment records between users
- **Balances**: Calculated debt relationships

### Sample Data
The application includes comprehensive sample data for:
- 4 sample users with different currencies
- 2 sample groups (Trip and Home)
- Multiple sample expenses with various split methods
- Settlement records and balance calculations

## 🔧 Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build

# Code Quality
pnpm run lint         # Run ESLint
pnpm run type-check   # TypeScript type checking
```

## 🌐 Deployment

### Build for Production
```bash
pnpm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Firebase Hosting**: Deploy with Firebase CLI

## 🔮 Future Enhancements

### Planned Features
- [ ] **Real-time Collaboration**: Live updates when others add expenses
- [ ] **Push Notifications**: Expense reminders and balance alerts
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Bill Splitting**: Restaurant bill splitting with tip calculations
- [ ] **Recurring Expenses**: Subscription and recurring bill tracking
- [ ] **Export Options**: More export formats (Excel, JSON)
- [ ] **Multi-language Support**: Internationalization
- [ ] **PWA Features**: Offline-first progressive web app

### Backend Integration
- [ ] **Supabase Integration**: Real-time database and authentication
- [ ] **User Authentication**: Secure login and registration
- [ ] **Cloud Storage**: Receipt photo storage
- [ ] **Payment Integration**: Stripe/PayPal integration for settlements
- [ ] **Email Notifications**: Expense and settlement notifications

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Add TypeScript types for all new code
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sabiq Sabry**
- GitHub: [@sabiqsabry](https://github.com/sabiqsabry)
- Project: [Hisab Repository](https://github.com/sabiqsabry/Hisab)

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Radix UI** for accessible headless components
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the amazing framework
- **Splitwise** for inspiration on expense sharing UX

## 📞 Support

If you have any questions or need help:

1. **Check the Issues**: Look through existing GitHub issues
2. **Create an Issue**: Open a new issue with detailed information
3. **Contact**: Reach out through GitHub or email

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Sabiq Sabry](https://github.com/sabiqsabry)

</div>