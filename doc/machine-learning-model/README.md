# 🏋️ FireSight AI - Machine Learning Model Training Documentation

This document describes the complete process of training and validating the **fire-predict-v3** regression model using **Azure Machine Learning**. It covers infrastructure setup, data preparation, AutoML configuration, model selection, and deployment.

---

## 🖥️ 1. Compute Infrastructure

To ensure efficient training over large datasets, we provisioned a **high-performance virtual machine (VM)** on Azure ML.

| Component     | Specification                            |
|---------------|-------------------------------------------|
| **VM Name**   | `vm-cara`                                 |
| **VM Size**   | `Standard_E32s_v3`                        |
| **Resources** | 32 vCPUs, 256 GB RAM, 512 GB SSD          |
| **Estimated Cost** | ~$2.13/hour                         |

> **Rationale:** The choice of a high-powered VM was strategic. Due to the volume and complexity of data, especially with cross-validation, we needed significant compute and memory capacity to iterate quickly—critical during time-sensitive events like hackathons.

---

## 📊 2. Data Preparation (Data Asset)

The first step was to register the dataset within Azure ML as a **versioned and reusable asset**.

- **Action:** Create Data Asset  
- **Source File:** `dataset_final.csv`  
- **Registered Asset:** `wildfiredataset` (Type: Table)

> By registering the file as a **Data Asset**, we make it reusable across ML experiments without re-uploading. Declaring it as a “Table” enables Azure ML to understand its structure and optimize it for training workflows.

---

## 🤖 3. Training with Azure Automated ML (AutoML)

To accelerate experimentation and achieve optimal performance, we used **Azure's AutoML** to automate model development and hyperparameter tuning.

### 🛠️ Configuration

| Parameter              | Configuration                                  |
|------------------------|-----------------------------------------------|
| **Task Type**          | Regression                                     |
| **Target Column**      | `is_on_fire` (Integer)                         |
| **Primary Metric**     | Normalized Root Mean Squared Error (NRMSE)     |
| **Blocked Models**     | All except `XGBoostRegressor`                  |
| **Validation**         | k-Fold Cross Validation (`k=5`)                |
| **Test Split**         | 20%                                            |
| **Compute Target**     | `vm-cara`                                      |

### 🧠 Design Decisions

- **Regression:** Although `is_on_fire` is binary, we aim to predict a **risk score** (probability of fire), making regression the appropriate choice.
- **NRMSE:** The normalized RMSE helps interpret the average error relative to the target’s scale. Lower values indicate better performance.
- **XGBoost Only:** We restricted AutoML to optimize **only XGBoost**, a robust algorithm for tabular data, allowing it to fine-tune hyperparameters more effectively.

---

## ✅ 4. Best Model Output

After the AutoML job was completed, the best model was selected for deployment.

- **Model Name:** `fire-predict-v3`  
- **Version:** `1`  
- **Format:** `MLflow` (Model packaged for tracking, reproducibility, and deployment)

---

## 🚀 5. Model Deployment

The selected model was deployed as a **real-time online endpoint**, making it accessible to our applications.

### 🔧 Deployment Configuration

| Parameter             | Setting                                        |
|------------------------|-----------------------------------------------|
| **Deployment Name**   | `fire-predict-v3-deploy`                       |
| **Instance Count**    | `3`                                            |
| **VM Size**           | `Standard_DS1_v2` (1 vCPU, 3.5 GB RAM, 7 GB Disk) |

> **Deployment Rationale:** Inference workloads are lighter than training. Smaller VMs are sufficient and cost-effective. Running **3 instances** ensures **high availability** and **load balancing**, allowing the endpoint to serve multiple simultaneous requests efficiently.

---

