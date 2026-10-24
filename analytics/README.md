# Crop Yield Risk & Advisory Dashboard — Analytics

## 1. Overview

This analytics module prepares historical agricultural data and generates an explainable crop yield-risk score for:

- Uttar Pradesh
- Punjab
- Haryana

Target crops:

- Wheat
- Rice
- Maize

Crop years:

- 2021-22
- 2022-23
- 2023-24
- 2024-25

The final data grain is:

**State + District + Crop + Year**

---

## 2. Data Sources

### Production Data

Production, cultivated area, and yield data were collected from official agricultural production datasets.

Important fields:

- State
- District
- Crop
- Year
- Area
- Production
- Yield

### Rainfall Data

Rainfall data was collected from NASA POWER.

Daily rainfall was converted into crop-year features such as:

- Crop-year rainfall
- Rainy days
- Heavy-rain days
- Monsoon rainfall
- Rabi rainfall
- Historical rainfall average
- Rainfall deviation

### Market Price Data

Price data was collected from AGMARKNET 2.0.

Monthly market observations were mapped from market/APMC level to district level.

The district monthly price is calculated using the median of available market observations.

Annual price features include:

- Average modal price
- Minimum monthly price
- Maximum monthly price
- Price standard deviation
- Price volatility
- Months available
- Price coverage quality

Missing AGMARKNET observations are preserved as missing values and are never converted to zero.

---

## 3. Main Processed Dataset

The combined analytical dataset contains:

**Production + Rainfall + Market Price + Risk Features**

Main file:

`data/processed/analytics_master_with_risk_2021_2025.csv`

---

## 4. Risk Model

The final MVP uses an **explainable weighted rule-based risk model**.

Four historical signals are used:

1. Previous yield trend
2. Previous rainfall anomaly
3. Previous cultivated-area trend
4. Previous market-price volatility

Base weights:

- Yield trend: **35%**
- Rainfall anomaly: **30%**
- Area trend: **20%**
- Price volatility: **15%**

Each risk component is converted to a 0–100 score.

Component scaling uses the historical 95th percentile of adverse signals from:

- 2022-23
- 2023-24

If one risk driver is missing, that driver is excluded and the remaining available weights are re-normalized.

Missing data is **not interpreted as zero risk**.

---

## 5. Risk Data Quality

Risk scores include a data-quality indicator:

- **Complete** = 4 drivers available
- **Good** = 3 drivers available
- **Limited** = 2 drivers available
- **Very Limited** = 1 driver available
- **Insufficient** = 0 drivers available

Dashboard risk scores require at least **2 available drivers**.

---

## 6. Top Risk Drivers

For every usable risk score, the system identifies the largest contributing drivers:

- `top_driver_1`
- `top_driver_2`
- `top_driver_3`

Only drivers with a positive risk contribution are included.

---

## 7. Machine Learning Experiments

Machine-learning approaches were also tested using a time-based split.

Training years:

- 2022-23
- 2023-24

Test year:

- 2024-25

Experiments included:

- Dummy regression
- Ridge regression
- Random Forest regression
- Direct 0–100 risk regression
- Two-stage risk modelling

The ML models showed limited generalization on unseen 2024-25 data, particularly because Maize yield deviation was highly volatile.

Therefore, the explainable weighted risk model was selected for the MVP.

The ML work is retained as an experimental comparison and can be improved when more historical data becomes available.

---

## 8. Backend Handoff

Main backend files:

- `data/processed/backend_handoff_2021_2025.csv`
- `data/processed/backend_handoff_2024_25.csv`

Backend grain:

**state + district + crop + year**

Important fields:

- `state`
- `district`
- `crop`
- `year`
- `rainfall_mm`
- `avg_price`
- `area_hectares`
- `production`
- `yield_kg_per_hectare`
- `risk_score`
- `risk_data_quality`
- `drivers_available`
- `top_driver_1`
- `top_driver_2`
- `top_driver_3`

---

## 9. Important Missing-Value Rules

`avg_price = null`

means AGMARKNET price data was unavailable.

It does **not** mean the price was zero.

`risk_score = null`

means there were not enough historical risk drivers to produce a reliable dashboard score.

It does **not** mean zero risk.

---

## 10. Yield Unit

The source `Yield` field was validated numerically against:

`Production × 1000 / Area`

The median relative difference was approximately **0.30%**.

For the project data contract, the field is represented as:

`yield_kg_per_hectare`

and is kept separate from total production.

---

## 11. Current 2024-25 Risk Output

The latest dashboard dataset contains **355 State-District-Crop rows**.

- **348 rows** have usable dashboard risk scores.
- **7 rows** have insufficient historical driver coverage for a published risk score.

---

## 12. Main Output Files

- `production_history_2021_2025.csv`
- `rainfall_features_2021_2025.csv`
- `production_rainfall_merged_2021_2025.csv`
- `price_features_2021_2025.csv`
- `analytics_master_2021_2025.csv`
- `analytics_master_with_risk_2021_2025.csv`
- `dashboard_risk_output_2024_25.csv`
- `backend_handoff_2021_2025.csv`
- `backend_handoff_2024_25.csv`
- `risk_model_config.json`

---

## 13. Model Interpretation

The risk score should be interpreted as an **explainable historical-signal-based yield risk assessment**.

It is **not a guaranteed prediction of future crop yield**.
