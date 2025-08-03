# 🏠 Block-Immo - Fractional Real Estate Investment Platform

> **Modern Full-Stack Development Showcase**  
> **Built with React, AWS Serverless, Material-UI**

## 🎯 **Project Overview**

**Block-Immo** is a modern fractional real estate investment platform that demonstrates advanced full-stack development capabilities. The application showcases a complete investment ecosystem with real-time calculations, property management, and user authentication.

## 🚀 **Key Features**

### **💰 Investment System**
- Real-time investment calculator with interactive charts
- Fractional ownership with 10€ minimum investment blocks
- Portfolio tracking and transaction history
- Advanced financial calculations (ROI, yields, appreciation)

### **🏢 Property Management**
- Complete CRUD operations for real estate properties
- Advanced photo management with S3 integration
- Google Maps integration for property location
- Dynamic filtering and search capabilities

### **🔐 Authentication & Security**
- AWS Cognito user management
- Role-based access control (Investor, Professional, Admin)
- JWT token authentication with automatic refresh
- Secure API endpoints with IAM policies

### **📊 Analytics Dashboard**
- Interactive charts with Chart.js
- Real-time financial calculations
- Portfolio performance tracking
- Transaction history with detailed analytics

## 🛠️ **Technical Stack**

### **Frontend**
- **React 18.3.1** - Modern hooks and concurrent features
- **Material-UI 5.16.7** - Custom design system
- **React Router 6.27.0** - Client-side routing
- **Formik 2.4.6** - Form management and validation
- **Chart.js 4.4.6** - Interactive data visualization
- **React Query 3.39.3** - Server state management

### **Backend & Infrastructure**
- **AWS Lambda** - 20+ serverless functions
- **AWS DynamoDB** - NoSQL database optimized for real estate data
- **AWS S3** - Image storage with CDN
- **AWS Cognito** - User authentication and authorization
- **API Gateway** - RESTful API with rate limiting

### **Development Tools**
- **ESLint** - Code quality and consistency
- **Prettier** - Automatic code formatting
- **GitHub Actions** - CI/CD pipeline
- **Serverless Framework** - Infrastructure as code

## 🏗️ **Architecture Highlights**

### **Serverless Architecture**
```yaml
# Comprehensive Lambda function structure
functions:
  - get-properties: Property listing and filtering
  - create-property: Property creation with validation
  - update-property: Property updates with audit trail
  - buy-shares: Investment transaction processing
  - upload-photos: S3 integration with image optimization
  - get-portfolio: User investment portfolio
  - get-user-profile: User management
  - verify-roles: Role-based access control
```

### **Database Design**
```javascript
// DynamoDB schema optimized for real estate queries
{
  PK: "PROPERTY#propertyId",
  SK: "METADATA",
  title: "Modern Apartment",
  price: 1200000,
  yield: 8.5,
  location: { city: "Aix-en-Provence", country: "France" },
  photos: ["url1", "url2"],
  status: "COMMERCIALIZED"
}
```

### **Frontend Architecture**
```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Validated form components
│   ├── modals/         # Investment and property modals
│   └── charts/         # Data visualization
├── services/           # API service layer
│   ├── api/           # REST API integration
│   └── auth/          # Authentication services
├── hooks/             # Custom React hooks
├── context/           # State management
└── utils/             # Utility functions
```

## 📈 **Performance & Quality Metrics**

### **Code Quality**
- **ESLint**: Zero errors, zero warnings
- **Prettier**: Consistent code formatting
- **TypeScript Ready**: Structured for type safety
- **Modular Architecture**: Reusable components and services

### **Performance**
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### **Scalability**
- **Auto-scaling**: Lambda functions adapt to load
- **CDN**: Global content delivery
- **Database**: DynamoDB adaptive capacity
- **API**: Intelligent rate limiting

## 🎨 **Design System & UX**

### **Material-UI Customization**
```javascript
// Custom theme for real estate platform
const theme = createTheme({
  palette: {
    primary: { main: '#4472C4' },
    secondary: { main: '#2E7D32' },
    background: { default: '#F8F9FA' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif'
  }
});
```

### **Responsive Design**
- **Mobile-first** approach
- **Breakpoint optimization** for all screen sizes
- **Touch-friendly** interfaces
- **Accessibility** compliance (WCAG 2.1)

## 🔧 **Development Setup**

### **Prerequisites**
- Node.js (v16+)
- AWS CLI configured
- Serverless Framework

### **Installation**
```bash
# Clone repository
git clone https://github.com/souhailsouid/block-immo.git
cd block-immo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure AWS credentials and API keys

# Start development server
npm start
```

### **Environment Configuration**
```env
# AWS Configuration
REACT_APP_AWS_REGION=eu-west-1
REACT_APP_AWS_USER_POOLS_ID=your_user_pool_id
REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID=your_client_id
REACT_APP_AWS_IDENTITY_POOL_ID=your_identity_pool_id

# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🚀 **Deployment**

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Deploy to AWS S3 + CloudFront
npm run deploy
```

### **Backend Deployment**
```bash
# Deploy Lambda functions
cd lambda-functions
serverless deploy --stage production
```

## 📊 **Project Statistics**

### **Codebase Metrics**
- **268 files** modified/created
- **71,775 lines** of code added
- **20+ Lambda functions** implemented
- **15+ React components** developed
- **10+ responsive pages** created

### **Technical Achievements**
- **100%** MVP features implemented
- **95+** Lighthouse performance score
- **0** ESLint errors
- **Mobile-responsive** design
- **Serverless** architecture

## 🎯 **Learning Outcomes**

This project demonstrates proficiency in:

### **Modern Frontend Development**
- React 18 with hooks and concurrent features
- Material-UI design system customization
- State management with Context API and React Query
- Performance optimization and lazy loading

### **Cloud Architecture**
- AWS serverless services (Lambda, DynamoDB, S3, Cognito)
- API Gateway and RESTful API design
- Security best practices with IAM policies
- Scalable database design patterns

### **DevOps & Quality**
- CI/CD with GitHub Actions
- Code quality tools (ESLint, Prettier)
- Monitoring and logging
- Infrastructure as code

## 📞 **Contact & Links**

- **Repository**: https://github.com/souhailsouid/block-immo
- **Demo**: [Live demo link]
- **Documentation**: [Technical documentation]

---

*This project showcases modern full-stack development capabilities with a focus on user experience, performance, and scalable architecture.* 