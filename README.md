# GasFinder - Real-Time Fuel Intelligence Platform

A modern web application that helps users find the cheapest gas prices in their area using real-time location data and an intuitive editorial-inspired interface.

## 🚀 Features

- **Real-Time Location Detection**: Automatic GPS positioning with manual search fallback
- **Price Comparison**: Sort stations by distance and price
- **Interactive Maps**: Google Maps integration with station markers
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Docker Deployment**: Production-ready containerization

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks and state management
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

### APIs & Services
- **Google Maps API** for location services and mapping
- **Google Places API** for gas station data
- **Geolocation API** for user positioning

### DevOps & Deployment
- **Docker** for containerization
- **Docker Compose** for multi-service orchestration
- **GitHub Actions** for CI/CD automation
- **Multi-stage builds** for optimized production images

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Google Maps    │    │   Docker Hub    │
│   (Frontend)    │◄──►│     API         │◄──►│  (Container)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Tailwind CSS   │    │  Places API     │    │ GitHub Actions  │
│   (Styling)     │    │  (Station Data) │    │   (CI/CD)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Maps API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gasapp
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Google Maps API key to .env
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Build individual Docker image**
   ```bash
   npm run docker:build
   ```

3. **Run Docker container**
   ```bash
   npm run docker:run
   ```

## 📊 Project Structure

```
src/
├── components/
│   ├── StationCard.jsx    # Main station display component
│   ├── Map.tsx          # Google Maps integration
│   └── SkeletonCard.jsx  # Loading state component
├── utils/
│   ├── api.js           # API integration logic
│   ├── location.js      # Geolocation utilities
│   └── mockPrices.js    # Price simulation
├── App.tsx             # Main application component
└── index.css           # Global styles
```

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container

# Code Quality
npm run lint         # Run ESLint
```

## 🎯 Design Philosophy

The application follows an editorial print design approach:
- **Data-First**: Price and distance are the primary information hierarchy
- **Minimal Interface**: Clean, focused user experience
- **Dark Theme**: High contrast for optimal readability
- **Typography-Driven**: Information conveyed through text hierarchy

## 📈 Performance Optimizations

- **Lazy Loading**: Components load on-demand
- **Image Optimization**: SVG icons and optimized assets
- **Code Splitting**: Reduced bundle sizes
- **Caching Strategy**: API response caching
- **Docker Layers**: Optimized build process

## 🔒 Security Considerations

- **Environment Variables**: API keys secured in .env files
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Sanitized user inputs
- **Container Security**: Minimal base images

## 📝 Development Journal

This project was developed as part of a learning journey, with detailed documentation of challenges, solutions, and growth. 

**Journal Entries:**
- [Initial Setup & Architecture Planning](./docs/journal/01-setup.md)
- [Google Maps API Integration Challenges](./docs/journal/02-api-integration.md)
- [Docker Containerization Process](./docs/journal/03-docker-setup.md)
- [Design System Implementation](./docs/journal/04-design-system.md)
- [Performance Optimization Journey](./docs/journal/05-performance.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps Platform for location services
- React team for the excellent framework
- Tailwind CSS for utility-first styling
- Docker team for containerization tools

---

**Built with ❤️ and lots of ☕**

## 📋 Interview Presentation

For interview purposes, please see [SLIDE_CONTENT.md](./SLIDE_CONTENT.md) for detailed presentation material covering:
- Technical challenges and independent learning
- AI-assisted development process
- Docker containerization strategy
- GitHub CI/CD pipeline implementation
- Learning outcomes and future roadmap
