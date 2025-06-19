# 🤖 FireSight AI Chatbot Documentation

This document outlines the architecture, technologies, and implementation process of the decision-support chatbot for the FireSight AI project.

![chatbot]()

---

## 🎯 Objective

The chatbot was designed to act as an **AI Assistant and Advisor** integrated into the FireSight AI platform. Its main goal is to provide quick answers and strategic recommendations to users (such as planners and emergency response teams) using **natural language**. It can answer questions about risks in specific locations, explain data, and offer advice based on a specialized knowledge base on wildfires.

---

## 🏛️ Architecture and Tools

To build and deploy the chatbot in a robust, scalable, and secure manner, we used an ecosystem of integrated **Microsoft Azure** services.

| Tool / Service                    | Purpose in the Project                                                                 |
|----------------------------------|-----------------------------------------------------------------------------------------|
| 🤖 Azure Bot Service             | Central orchestrator that connects the bot to communication channels and the AI logic. |
| 📦 Azure Container Registry (ACR)| Private repository to store and manage the bot's Docker image.                         |
| 🌐 Azure App Service             | Platform to host the bot's web application in a managed environment.                   |
| 🆔 Managed Identity              | Enables secure, passwordless authentication between Azure services (e.g., App Service to ACR). |
| 🔍 Application Insights          | Application Performance Monitoring (APM) tool to track the bot's health and usage.     |
| 🔑 Azure Key Vault               | Secure vault for storing secrets, API keys, and connection strings.                    |
| 💻 Bot Framework Template        | Starting point for development using the "Empty Bot" template with .NET Core 3.1.      |

---

## ⚙️ Deployment Process

The chatbot was deployed using a **containerization workflow**, ensuring consistency between development and production environments.

1. **Local Development:**  
   Built using the "Empty Bot" template from the Bot Framework on .NET Core 3.1.

2. **Docker Containerization:**  
   A `Dockerfile` was created to package the bot and its dependencies into a standard Docker image.

3. **Push to ACR:**  
   The Docker image was pushed to our private registry:  
   `acrhackatonfire.azurecr.io/hackaton-fire`

4. **Hosting on App Service:**  
   - A Linux-based App Service instance was configured to run containers.  
   - The associated plan is `ASP-pocchatbot-9d39 (SKU: B1)`.  
   - The App Service is configured to **pull images directly from ACR** using a **User-Assigned Managed Identity**—eliminating the need for admin credentials.  
   - This enables **secure and automated deployment** whenever a new image version is pushed to ACR.

---

## 🔌 User Communication via Direct Line

To integrate the chatbot with our web application (React frontend), we used the **Direct Line** channel.

- **What is it?**  
  A REST API that allows the client application to communicate directly with the bot—bypassing public channels like Teams or Slack.
- **Advantages:**  
  Full control over UI, secure authentication with a secret key, and a private, customizable chat experience.

---

## 🧠 Artificial Intelligence (RAG) with Copilot Studio

To empower the chatbot with the ability to provide consultative and accurate answers about wildfires, we implemented the **Retrieval-Augmented Generation (RAG)** pattern.

### 🔍 What is RAG?

An AI technique where the language model **first retrieves relevant information** from an external source and then generates a response using both its general knowledge and the retrieved context.

### 🧠 AI Tools Used

- **AI Agent:**  
  We used **Microsoft Copilot Studio** to orchestrate the RAG flow. It:
  - Receives the user's question
  - Retrieves relevant documents
  - Crafts a contextual and intelligent response

- **Knowledge Base:**  
  We indexed a series of peer-reviewed academic papers on fire ecology and wildfire management, such as:

  - [*Forest fire propagation, observed and simulated*](https://repository.geologyscience.ru/bitstream/handle/123456789/44865/Shak_06.pdf?sequence=1&isAllowed=y)

  - [*Climate Change and Fire Regimes in the North American Boreal Forest*](https://research.fs.usda.gov/treesearch/download/65524.pdf)  

  - [*Fire Regimes of the Conterminous United States—A Multiscale Assessment*](https://www.mdpi.com/2571-6255/1/1/9)  

  - [*Wildfire-driven forest conversion in western North American landscapes*](https://www.fs.usda.gov/rm/pubs_journals/2019/rmrs_2019_mcwethy_d001.pdf)  

  - [*Ecological effects of fire*](https://www7.nau.edu/mpcer/direnet/publications/publications_m/files/McKenzie_et_al_2004.pdf)  

  - [*How climate change and fire exclusion drive wildfire regimes at odds with fire-adapted ecosystems*](https://www.pnas.org/doi/pdf/10.1073/pnas.2011048118)

> 🔬 **Using RAG with these sources enables the bot to deliver more accurate, relevant, and evidence-based responses**—far beyond the capabilities of a generic model.
