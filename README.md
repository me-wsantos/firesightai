
# 🔥 FireSight AI

<p align="center">
<img 
    src="https://github.com/devcaiada/firesightai/blob/main/public/doc/logo_horizontal_alternativo.png?raw=true"
    width="500"  
/>
</p>

## 🚀 About The Project

**FireSight AI** is a geospatial intelligence platform that leverages the power of **Machine Learning** on **Microsoft Azure** to predict high-risk wildfire ignition zones up to **48 hours in advance**.

Our mission is to **transform reactive data into proactive insights**, empowering emergency responders, urban planners, environmental agencies, and policymakers to **protect lives, ecosystems, and communities before the first flame appears**.

FireSight AI is more than a dashboard. It's a comprehensive solution integrating geospatial data, predictive modeling, and an intelligent agent — all designed to offer **early warnings**, **actionable analytics**, and **real-time support**.

---

### 🎥 [Check out our live demo!]()

---

## ✨ Features

| Icon | Feature                    | Description                                                                 |
|------|----------------------------|-----------------------------------------------------------------------------|
| 🔥   | Hotspot Prediction         | Identifies geographic coordinates with a high probability of fire ignition. |
| 🗺️   | Interactive Heatmap       | Visualizes intensity and concentration of fire risk across regions.         |
| 🤖   | AI Assistant with RAG      | Natural-language chatbot offering real-time insights and predictions.       |
| 📚   | Scientific Knowledge Base  | Retrieval-Augmented Generation (RAG) using academic wildfire literature.    |
| 📈   | Historical Data Analysis   | Query past fire data for strategic planning and pattern recognition.        |

![historical-data](https://github.com/devcaiada/firesightai/blob/main/public/doc/historical-data.jpeg?raw=true)

---

## 🛠️ Technologies

This project uses modern **Cloud**, **AI**, and **Web** technologies with a strong emphasis on the **Microsoft Azure** ecosystem.

| Area            | Technologies                                                                 |
|------------------|------------------------------------------------------------------------------|
| Cloud & AI       | Azure Machine Learning Studio, Azure Functions, Azure App Service, Azure Container Registry, Microsoft Copilot Studio |
| Backend & Model  | Python, FastAPI, .NET Core, Scikit-learn, XGBoost                           |
| Frontend         | React, Mapbox GL, Typescript JS                                                         |
| Data Sources     | NASA FIRMS, INPE Queimadas, Open-Meteo API                                  |

---

## 🧠 Architecture

The FireSight AI platform is composed of three main systems working together:

1. **Frontend** – A modern React web interface with an interactive map.
2. **Azure Functions API Gateway** – Serves as the bridge between user requests, the ML model, and data services.
3. **ML Backend (Azure ML)** – Hosts and serves the trained fire prediction model.

We also integrate **Copilot Studio** to provide an intelligent assistant capable of accessing weather APIs and prediction endpoints through orchestrated flows.

📄 For a complete overview, refer to our [Architecture Documentation](./architecture.md).

---

## 🧪 AI & Model Engineering

Our model was trained using real-world ignition events from NASA and INPE, enriched with meteorological data via Open-Meteo API. A balanced dataset was created using a "Time-Shift" method for non-fire events.

The training process, API exposure, and validation steps are available in our:
- [💾 Dataset Construction Documentation](./dataset_documentation.md)
- [🏋️ Model Training Documentation](./training_documentation.md)
- [🧠 ML Model Documentation](./ml_model_documentation.md)
- [🤖 Copilot Studio & Chatbot Documentation](./copilot_studio_documentation.md)

---

## 🚀 Getting Started

To run the project locally, follow the steps below:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/FireSightAI.git
cd FireSightAI

# Follow the detailed guide here:
# ➡️ Complete Installation Guide (coming soon)
```

You will need an Azure account, Open-Meteo API access, and Mapbox API key to run the full stack.

---

## 📖 Documentation

We believe that great documentation is key to open collaboration and adoption. Explore our dedicated guides:

- 🤖 [Chatbot Documentation (Copilot Studio)](./copilot_studio_documentation.md)
- 🧠 [ML Model Endpoint & API Gateway](./ml_model_documentation.md)
- 🏋️ [Model Training Process](./training_documentation.md)
- 💾 [Dataset Construction](./dataset_documentation.md)

---

## 👥 Team

| Name              | Role                             |
|-------------------|----------------------------------|
| [Your Name]       | Project Lead / Full-Stack Dev    |
| [Colleague 1]     | Machine Learning Engineer        |
| [Colleague 2]     | Frontend Developer               |
| [Colleague 3]     | Data & Azure Specialist          |

---

## 🌍 Vision

We're building a future where **AI empowers climate resilience**. FireSight AI aims to expand globally, integrating satellite feeds, drone imagery, and crowd-sourced reports to deliver **hyper-local** and **actionable wildfire intelligence**.

> Because the best way to fight fire — is before it starts.
