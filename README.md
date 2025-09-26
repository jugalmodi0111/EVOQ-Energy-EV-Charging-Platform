# 🚗⚡ EV Charging Station Business Platform

A comprehensive full-stack web application for planning, analyzing, and managing Electric Vehicle (EV) charging station businesses. This platform provides market research tools, location analysis, financial modeling, competitor analysis, and business planning capabilities.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)
![React](https://img.shields.io/badge/React-19.0+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Compatible-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Configuration](#environment-configuration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔍 Market Research & Analysis
- **Market Data Management**: Track EV adoption rates, population demographics, and market size
- **City-based Analysis**: Get comprehensive market insights for specific cities
- **Competition Analysis**: Monitor competitors and market positioning
- **Growth Projections**: Calculate market opportunities and potential revenue

### 📍 Location Analysis
- **Site Evaluation**: Analyze potential charging station locations
- **Traffic Analysis**: Assess daily traffic patterns and usage potential
- **Competition Mapping**: Identify nearby charging stations within radius
- **Revenue Estimation**: Calculate expected daily usage and revenue potential

### 💰 Financial Modeling
- **ROI Calculator**: Calculate return on investment and break-even analysis
- **Cost Analysis**: Track installation costs, maintenance, and operational expenses
- **Scenario Planning**: Create multiple financial scenarios and projections
- **Revenue Modeling**: Estimate charging fees and revenue streams

### 🏢 Business Management
- **Supplier Management**: Track equipment suppliers and procurement
- **Partnership Management**: Manage partnerships with property owners and organizations
- **Regulatory Compliance**: Track permits, regulations, and compliance requirements
- **Business Plan Generation**: Create comprehensive business plans

## 🛠 Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database with Motor async driver
- **Pydantic**: Data validation and serialization
- **Python-dotenv**: Environment variable management
- **Uvicorn**: ASGI server

### Frontend
- **React 19**: Latest React with modern features
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Efficient form management
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

## 📁 Project Structure

```
ev-charging-platform/
├── backend/                    # FastAPI backend
│   ├── server.py              # Main application file
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── venv/                  # Virtual environment
├── frontend/                  # React frontend
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
│   ├── package.json          # Node.js dependencies
│   └── public/               # Static assets
├── tests/                     # Test files
├── README.md                  # This file
└── .gitignore                # Git ignore rules
```

## 🚀 Installation

### Prerequisites
- **Python 3.8+**
- **Node.js 14+**
- **MongoDB** (local or cloud instance)
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ev-charging-platform.git
   cd ev-charging-platform
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

5. **Start the backend server**
   ```bash
   uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🌐 Usage

### Starting the Application

1. **Backend**: Visit `http://localhost:8001`
   - API Documentation: `http://localhost:8001/docs`
   - API Base URL: `http://localhost:8001/api`

2. **Frontend**: Visit `http://localhost:3000`
   - Modern, responsive UI
   - Real-time data visualization
   - Interactive forms and dashboards

### Key Workflows

1. **Market Research**
   - Add market data for different cities
   - Analyze market opportunities
   - Compare different markets

2. **Location Analysis**
   - Input potential site locations
   - Evaluate traffic and competition
   - Calculate revenue potential

3. **Financial Planning**
   - Create financial models
   - Run ROI calculations
   - Generate business plans

## 📖 API Documentation

### Market Data Endpoints

```http
POST /api/market-data
GET /api/market-data
GET /api/market-analysis/{city}
```

### Location Analysis Endpoints

```http
POST /api/locations
GET /api/locations
GET /api/location-analysis/{location_id}
```

### Financial Modeling Endpoints

```http
POST /api/financial-models
GET /api/financial-models
GET /api/roi-calculator
```

### Additional Endpoints

- **Competitors**: `/api/competitors`
- **Suppliers**: `/api/suppliers`
- **Partnerships**: `/api/partnerships`
- **Business Plans**: `/api/business-plans`
- **Regulatory Info**: `/api/regulatory-info`

For complete API documentation, visit `http://localhost:8001/docs` when the backend is running.

## ⚙️ Environment Configuration

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=ev_charging_db
CORS_ORIGINS=*
```

### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8001/api
```

## 🚦 Running Tests

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for scalability and performance
- Focuses on user experience and accessibility

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API docs at `/docs`

---

**Made with ❤️ for the future of electric mobility**
