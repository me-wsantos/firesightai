
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



---

## 🧪 AI & Model Engineering

Our model was trained using real-world ignition events from NASA and INPE, enriched with meteorological data via Open-Meteo API. A balanced dataset was created using a "Time-Shift" method for non-fire events.

The training process, API exposure, and validation steps are available in our:
- [💾 Dataset Construction Documentation](https://github.com/devcaiada/firesightai/tree/main/doc/machine-learning-endpoint#-data-source)

---

## 🚀 Getting Started

To run the project locally, follow the steps below:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/FireSightAI.git
cd FireSightAI

```

You will need an Azure account, Open-Meteo API access, and Mapbox API key to run the full stack.

---

## 📖 Documentation

We believe that great documentation is key to open collaboration and adoption. Explore our dedicated guides:

### - 🤖 [Chatbot Documentation (Copilot Studio)](https://github.com/devcaiada/firesightai/blob/main/doc/chatbot/README.md)
### - 🧠 [ML Model Endpoint & API Gateway](https://github.com/devcaiada/firesightai/blob/main/doc/machine-learning-endpoint/README.md)
### - 🏋️ [Model Training Process](https://github.com/devcaiada/firesightai/blob/main/doc/machine-learning-model/README.md)
### - 💾 [Front-end Architecture](https://github.com/devcaiada/firesightai/blob/main/doc/front-end/README.md)

---

## 🤝 Alignment with Microsoft AI Principles

FireSight AI was developed with a strong commitment to responsible and ethical AI, aligned with the core **Microsoft AI Principles**:

| Principle               | How We Apply It                                                                 |
|-------------------------|----------------------------------------------------------------------------------|
| **Fairness**            | Our model is trained on geographically diverse data to reduce regional bias.   |
| **Reliability & Safety**| We validate predictions with historical weather data and offer transparency in how results are generated. |
| **Privacy & Security** | No personal data is collected. All inputs are anonymized and securely processed in Azure. |
| **Inclusiveness**       | FireSight AI is designed to serve both authorities and vulnerable communities equally. |
| **Transparency**        | All prediction logic, dataset construction, and system prompts are documented openly. |
| **Accountability**      | The system never provides legal or emergency advice and always encourages users to contact local authorities in case of real danger. |

> We believe that AI must be **empowering, ethical, and transparent** — especially when it deals with risks to human lives and natural ecosystems.


## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Love%20Letter.png" alt="Love Letter" width="35" height="35" /> **Contact**
For questions or suggestions, please contact us.

| Caio Arruda  | Victor La Corte  | Wellington Santos  |
|:-----------:|:-----------:|:-----------:|
|[![LinkedIn](https://img.shields.io/badge/Linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/devcaiada)    | [![LinkedIn](https://img.shields.io/badge/Linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/victor-la-corte-348b81250/) | [![LinkedIn](https://img.shields.io/badge/Linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/-wellington-santos/) |


---

## 🌍 Vision

We're building a future where **AI empowers climate resilience**. FireSight AI aims to expand globally, integrating satellite feeds, drone imagery, and crowd-sourced reports to deliver **hyper-local** and **actionable wildfire intelligence**.

> Because the best way to fight fire — is before it starts.

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="35" height="35" /> **Contribution** 

Feel free to contribute to this repository. Open an issue or submit a pull request with your suggestions and improvements.

**If this project was helpful to you, leave a star! This helps us a lot.** <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png" alt="Star" width="25" height="25" />
