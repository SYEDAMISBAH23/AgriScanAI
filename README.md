# 🥝 AgriScan AI - Organic Produce Verification System

**Scan. Verify. Eat Healthy.**

AgriScan AI is an intelligent web application that helps consumers verify the authenticity of organic produce using AI-powered image analysis and PLU code verification.

![AgriScan AI](https://img.shields.io/badge/AI-Powered-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Status](https://img.shields.io/badge/status-live-success)

---

## 🌟 Features

### 🔍 **Smart Produce Scanning**
- **Dual AI Analysis**: Combines Hugging Face and Google Gemini AI for maximum accuracy
- **PLU Code Detection**: Automatically reads and verifies PLU stickers
- **Organic Verification**: Cross-references visual analysis with PLU codes to detect fraud

### 🧠 **Intelligent Verification**
- **Hybrid AI System**: Runs both models in parallel for speed
- **Conflict Detection**: Automatically flags mismatches between visual analysis and PLU codes
- **Reliability Scoring**: Provides confidence ratings for each scan

### 💬 **AI Assistant**
- **Interactive Chat**: Ask questions about nutrition, recipes, and safety tips
- **Context-Aware**: Knows exactly what produce you scanned
- **Markdown Formatting**: Clean, readable responses with bullet points

### 📊 **User Features**
- **Scan History**: Track all your scans with filtering (All/Organic/Non-Organic)
- **Fraud Reporting**: Report suspicious produce to help the community
- **Detailed Analysis**: View comprehensive breakdowns of each scan

---

## 🚀 Live Demo

**Try it now:** [AgriScan AI on Railway](https://agriscan-production.up.railway.app) *(coming soon)*

---

## 🛠️ Tech Stack

### Frontend
- **React** + **TypeScript** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Wouter** - Lightweight routing

### Backend
- **Node.js** + **Express** - Server framework
- **PostgreSQL** - Database (via Drizzle ORM)
- **Google Gemini AI** - Advanced vision analysis
- **Hugging Face API** - Primary produce classification

### AI Models
- **Gemini 2.5 Flash** - Vision analysis & verification
- **Custom Hugging Face Model** - Specialized produce detection

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- PostgreSQL (optional, for user features)
- Gemini API Key ([Get one here](https://ai.google.dev/))

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SYEDAMISBAH23/AgriScanAI.git
   cd AgriScanAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgresql://... # Optional
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

---

## 🌐 Deployment

### Deploy to Railway (Recommended)

1. **Push to GitHub** (already done! ✅)

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `AgriScanAI`
   - Add environment variable: `GEMINI_API_KEY`

3. **Your app is live!** 🎉

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed instructions.

---

## 📖 How It Works

### 1. **Capture Image**
User takes a photo of produce with their device camera

### 2. **Parallel AI Analysis**
- **Hugging Face**: Fast produce classification
- **Gemini AI**: Deep verification (runs simultaneously)

### 3. **Smart Decision Logic**
- ✅ **No Conflict**: Returns fast result (2-3 seconds)
- ⚠️ **Conflict Detected**: Uses Gemini's more accurate result

### 4. **PLU Verification**
- Reads PLU code from sticker
- Cross-references with database
- Flags mismatches (e.g., PLU says "Organic" but visual says "Non-Organic")

### 5. **Results Display**
- Produce name & confidence
- Organic status with reliability rating
- PLU code with meaning
- AI reasoning & recommendations

---

## 🎯 Use Cases

- **🛒 Grocery Shopping**: Verify organic claims before purchasing
- **🍎 Farmers Markets**: Ensure authenticity of "organic" labels
- **👨‍🍳 Restaurants**: Verify supplier claims
- **📚 Education**: Learn about PLU codes and organic standards

---

## 🔐 Privacy & Security

- ✅ **No Image Storage**: Scans are processed in real-time, not saved
- ✅ **Secure Authentication**: Password-protected user accounts
- ✅ **HTTPS Encryption**: All data transmitted securely
- ✅ **Local History**: Scan history stored only in your account

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Syed Amisbah**
- GitHub: [@SYEDAMISBAH23](https://github.com/SYEDAMISBAH23)
- Project: [AgriScan AI](https://github.com/SYEDAMISBAH23/AgriScanAI)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful vision analysis
- **Hugging Face** - For specialized produce classification
- **Railway** - For seamless deployment
- **Open Source Community** - For amazing tools and libraries

---

## 📞 Support

Having issues? Found a bug?
- 🐛 [Report a Bug](https://github.com/SYEDAMISBAH23/AgriScanAI/issues)
- 💡 [Request a Feature](https://github.com/SYEDAMISBAH23/AgriScanAI/issues)

---

## ⭐ Star This Project

If you find AgriScan AI useful, please consider giving it a star! It helps others discover the project.

---

**Made with ❤️ for healthier food choices**
