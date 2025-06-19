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

## ⚙️ Compute Infrastructure

To handle training and evaluation with high-volume meteorological datasets from **NASA FIRMS** and **NOAA**, a powerful compute instance was provisioned on Azure ML.

- **SKU:** `Standard_D2as_v4`  
- **Quota Type:** Dedicated  
- **Purpose:** High-performance CPU and memory balance, ideal for time-series model training.

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
    "latitude", "longitude", "temperature_2m", "relative_humidity_2m",
    "precipitation", "wind_speed_10m", "cloud_cover", "surface_pressure",
    "pressure_msl", "et0_fao_evapotranspiration", "soil_temperature_0_to_7cm",
    "daily_precipitation_sum", "daily_temperature_2m_max"
]

API_URL = "https://wildfire-hackaton-endpoint-v2.eastus2.inference.ml.azure.com/score"
API_KEY = "YOUR_ML_ENDPOINT_KEY_HERE"

@app.route(route="fire_prediction")
def fire_prediction(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received request for wildfire prediction.')

    try:
        req_body = req.get_json()
    except ValueError:
        req_body = {key: req.params.get(key) for key in EXPECTED_FIELDS}

    missing = [field for field in EXPECTED_FIELDS if field not in req_body]
    if missing:
        return func.HttpResponse(
            f"Missing fields in request: {', '.join(missing)}",
            status_code=400
        )

    try:
        input_data = {field: float(req_body[field]) for field in EXPECTED_FIELDS}
    except ValueError as e:
        return func.HttpResponse(f"Invalid input format: {e}", status_code=400)

    payload = json.dumps({
        "Inputs": {
            "data": [input_data]
        }
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
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