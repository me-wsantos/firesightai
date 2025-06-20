# 🧠 FireSight AI - Machine Learning Model Documentation

This document provides a detailed technical overview of the Machine Learning model used in the FireSight AI platform for wildfire risk prediction. It describes the training environment, scoring architecture, deployment process, and API gateway integration on Microsoft Azure.

---

## 🎯 Predictive Model Endpoint on Azure

At the heart of our predictive system is a **Machine Learning model deployed as a real-time REST endpoint** in **Azure Machine Learning Studio**. This enables the system to provide on-demand wildfire risk scoring for any given location.

| Component        | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Endpoint Name** | `wildfire-hackaton-endpoint-v2`                                             |
| **Deployment**    | `fire-predict-v2`                                                           |
| **Scoring Script**| `scoring_file_v_2_0_0.py` – Processes input, runs prediction, formats output |
| **Monitoring**    | Fully integrated with **Application Insights** for telemetry and diagnostics |

---

## 📊 Data Source

The performance of a Machine Learning model is directly dependent on the quality of its training data. This document outlines the methodological process used to construct the `dataset_final.csv` file — a robust and balanced dataset containing examples of conditions **with** and **without** fire occurrences.

---

### 🔥 Class 1: Points **WITH** Fire (`Target = 1`)

The first step was to gather a comprehensive sample of locations and times where fires were detected.

### 1.1. Obtaining Ignition Points

To ensure broad geographical coverage, we relied on two primary data sources:

| Region   | Data Source            | Link                                         |
|----------|------------------------|----------------------------------------------|
| 🇧🇷 Brazil   | NASA FIRMS (USFS)       | [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov) |
| 🇧🇷 Brazil | INPE Queimadas         | [dataserver-coids.inpe.br](https://dataserver-coids.inpe.br)          |

These sources provided the essential fire event data: **latitude**, **longitude**, **date**, and **time of detection**.

### 1.2. Enrichment with Meteorological Data

An ignition point alone is not enough — we must understand the **weather conditions** at the exact time of the event. For that, we used the following API:

- **API Used**: [Open-Meteo Historical Weather API](https://open-meteo.com)

For each fire point, we called this API using the **latitude**, **longitude**, **date**, and **time**, retrieving variables such as:

- Temperature  
- Relative humidity  
- Precipitation  
- Wind speed  
- And more


### 🌲 Class 2: Points **WITHOUT** Fire (`Target = 0`)

Creating the "no fire" class is a challenge. Simply selecting random points on the map could introduce bias, as geographic and seasonal conditions would vary. To solve this, we adopted a **Time-Shift** strategy.

### 2.1. The Time-Shift Strategy

- **Coordinate Reuse**: For each Class 1 point, we reused the same **latitude** and **longitude**.
- **Temporal Shift**: We subtracted **15 days** from the original fire event date.
- **Weather Enrichment**: We called the same Open-Meteo API to fetch meteorological data for this new time (same location, 15 days earlier).

> 💡 This technique allows us to create an almost perfect counterexample: the **same location**, observed at two **different moments** — one with fire and one, presumably, without. This helps the model focus on the **weather variations** that lead to ignition.

### 2.2. Challenges and Solutions

- **API Limitation**: The Open-Meteo API allows up to **10,000 requests per day**.
- **Solution**: A script was developed to automate data collection over multiple days, with programmed pauses to comply with the daily limit.


### 🔗 Final Dataset Merge and Cleaning

Once both classes were built, the following steps were performed:

- **Action**: The "with fire" and "without fire" datasets were combined.
- **Integrity Check**: We ensured that **no point** (same latitude, longitude, and date) appeared in both classes at the same time.


### ✅ Result

The result of this meticulous process is the `dataset_final.csv` file:  
A **clean, balanced, and enriched** dataset that served as the foundation for training all of our prediction models in **Azure Machine Learning**.

---

## ⚙️ Compute Infrastructure

To handle training and evaluation with high-volume meteorological datasets from **NASA FIRMS** and **NOAA**, a powerful compute instance was provisioned on Azure ML.

- **SKU:** `Standard_D2as_v4`  
- **Quota Type:** Dedicated  
- **Purpose:** High-performance CPU and memory balance, ideal for time-series model training.

![compute-vm-cara]()

---

## 🌍 Execution Environment

Reproducibility and consistency are crucial in ML workflows. We containerized the model training and scoring environment using **Docker** and **Conda**, ensuring consistent results across local development, cloud training, and inference.

### 🐳 Docker Environment

We built a custom Docker image using an official Azure ML base optimized for PyTorch and distributed computing. Key components:

```dockerfile
FROM mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu22.04:20250601.v1

WORKDIR /

ENV CONDA_PREFIX=/azureml-envs/designer-pytorch-2.3-train
ENV CONDA_DEFAULT_ENV=$CONDA_PREFIX
ENV PATH=$CONDA_PREFIX/bin:$PATH
ENV LD_LIBRARY_PATH=$CONDA_PREFIX/lib:$LD_LIBRARY_PATH

COPY conda_dependencies.yaml .

RUN conda env create -p $CONDA_PREFIX -f conda_dependencies.yaml -q && \
    rm conda_dependencies.yaml && \
    conda run -p $CONDA_PREFIX pip cache purge && \
    conda clean -a -y
```
### 🐍 Conda Environment

Dependencies are pinned to exact versions in a conda_dependencies.yaml file to ensure compatibility and reproducibility.

```YAML
name: project_environment
dependencies:
  - python=3.9.22
  - pip:
    - azureml-train-automl-runtime==1.60.0
    - inference-schema
    - xgboost<=1.5.2
    - prophet==1.1.4
    - azureml-interpret==1.60.0
    - azureml-defaults==1.60.0
  - numpy==1.23.5
  - pandas==1.5.3
  - scikit-learn==1.5.1
  - holidays==0.70
  - psutil==5.9.3
channels:
  - anaconda
  - conda-forge
```
---

### ⚡ API Gateway with Azure Functions

While Azure ML endpoints offer secure scoring capabilities, exposing them directly to clients is not recommended. To mitigate this, we implemented a serverless API Gateway using Azure Functions.

| Component            | Detail                                                     |
|----------------------|------------------------------------------------------------|
| **Function App Name**| `fire-endpoint`                                            |
| **Default Domain**   | `https://fire-endpoint.azurewebsites.net`                 |
| **Hosting Plan**     | `Flex Consumption` (auto-scales with traffic)              |
| **Operating System** | Linux                                                      |
| **Memory Allocated** | 2048 MB    

### 📊 Endpoint Usage (Last 30 Days)

Using Application Insights, we monitor all traffic and error handling in real time.

✅ Total Requests: 257

🟢 Successful Predictions: 247

🔴 Errors Logged: 10

### 🔒 Azure Function Logic

The gateway logic is written in Python and acts as a secure, authenticated proxy to the Azure ML model endpoint.

```python
import azure.functions as func
import logging
import urllib.request
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

EXPECTED_FIELDS = [
    "temperature_2m",
    "relative_humidity_2m",
    "wind_speed_10m",
    "surface_pressure",
    "et0_fao_evapotranspiration",
    "soil_temperature_0_to_7cm",
    "soil_moisture_0_to_7cm",
    "vapour_pressure_deficit",
    "shortwave_radiation_instant",
    "boundary_layer_height"
]

API_URL = "https://wildfire-hackathon-endpoint-v2.eastus2.inference.ml.azure.com/score"
API_KEY = ""

@app.route(route="fire_prediction")
def fire_prediction(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received request for wildfire prediction.')

    try:
        req_body = req.get_json()
    except ValueError:
        req_body = {key: req.params.get(key) for key in EXPECTED_FIELDS}

    # Verifica se todos os campos esperados estão presentes
    missing = [field for field in EXPECTED_FIELDS if field not in req_body]
    if missing:
        return func.HttpResponse(
            f"Missing fields in request: {', '.join(missing)}",
            status_code=400
        )

    try:
        # Cria dicionário com valores convertidos para float
        input_data = {field: float(req_body[field]) for field in EXPECTED_FIELDS}
    except ValueError as e:
        return func.HttpResponse(f"Invalid input format: {e}", status_code=400)

    # Monta o payload no formato esperado pelo modelo
    payload = json.dumps({
        "Inputs": {
            "data": [input_data]
        }
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    try:
        request = urllib.request.Request(API_URL, payload, headers)
        response = urllib.request.urlopen(request)
        result = response.read()
        return func.HttpResponse(result.decode("utf-8"), mimetype="application/json")
    except urllib.error.HTTPError as error:
        logging.error(f"Error calling model: {error}")
        return func.HttpResponse(
            f"Model request failed: {error.read().decode('utf-8', 'ignore')}",
            status_code=500
        )
```

### ✅ Summary

FireSight AI's ML system provides:

🔄 Real-time wildfire risk predictions via secure Azure ML endpoints

🐳 Dockerized and reproducible training pipeline using Conda + Docker

🔐 Safe external access through Azure Functions API Gateway

📈 Telemetry and metrics through Application Insights

🌎 Domain knowledge backed by NASA and NOAA datasets

🧭 The model empowers smarter, faster decisions for wildfire prevention and emergency preparedness.