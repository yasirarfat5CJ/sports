# Student Final Exam Marks Prediction Report

## Dataset

- Dataset file: `student_marks_dataset_dirty.csv`
- Initial shape: (10300, 8)
- Clean shape: (10097, 8)
- Predictive feature count: 6
- Target variable: `final_exam_marks`
- Identifier retained for traceability but excluded from `X`: `student_id`
- Missing expected columns: []
- Accidental index columns removed: []
- Numeric conversion new missing values: `{'attendance_pct': 0, 'study_hours_week': 0, 'assignment_score': 0, 'internal_marks': 0, 'prev_sem_cgpa': 0, 'activity_score': 0, 'final_exam_marks': 0}`
- Exact duplicate rows removed: 203
- Repeated student IDs retained for review count: 97
- Rows before target cleaning: 10300
- Rows removed for missing target: 0
- Rows remaining after target cleaning: 10300
- Domain-invalid records removed: 0
- Remaining missing values are handled inside training pipelines using median imputation for input features only.

## Initial Inspection

Columns: `['student_id', 'attendance_pct', 'study_hours_week', 'assignment_score', 'internal_marks', 'prev_sem_cgpa', 'activity_score', 'final_exam_marks']`

Data types:

```json
{
  "student_id": "object",
  "attendance_pct": "float64",
  "study_hours_week": "float64",
  "assignment_score": "float64",
  "internal_marks": "float64",
  "prev_sem_cgpa": "float64",
  "activity_score": "float64",
  "final_exam_marks": "float64"
}
```

Initial missing values:

```json
{
  "student_id": 0,
  "attendance_pct": 260,
  "study_hours_week": 394,
  "assignment_score": 452,
  "internal_marks": 224,
  "prev_sem_cgpa": 504,
  "activity_score": 452,
  "final_exam_marks": 0
}
```

First 5 rows:

```text
student_id  attendance_pct  study_hours_week  assignment_score  internal_marks  prev_sem_cgpa  activity_score  final_exam_marks
    S06781            94.5              24.1              70.5           74.10           8.76            53.8             91.22
    S09121            92.4              27.1              76.0           91.80            NaN            84.7             89.68
    S04870            74.2              11.2              71.9           57.80           7.15            76.0             71.08
    S02579            65.1               8.9              52.5           49.81           6.51            25.7             45.56
    S08169            89.0              24.1              85.3           90.40           8.96            74.2             95.55
```

Last 5 rows:

```text
student_id  attendance_pct  study_hours_week  assignment_score  internal_marks  prev_sem_cgpa  activity_score  final_exam_marks
    S04024            65.5               4.6              61.6            54.0           8.11            63.1             56.18
    S07260            85.7               NaN               NaN            56.2           7.81            67.3             72.30
    S05201            78.4              13.0              63.4            42.9           6.15             NaN             55.38
    S03776            84.3              19.3              79.3            75.2           8.79             NaN            100.00
    S04771            86.5              25.6              82.7            71.1          10.00            74.8             94.33
```

## Validation And Cleaning

The expected schema was verified after stripping leading/trailing column whitespace. `student_id` was never used as a predictive feature. Numeric columns were converted with `pd.to_numeric(errors="coerce")` and newly introduced missing values were counted. The target was not imputed; any missing target rows would be removed because supervised training needs observed labels.

Domain validation used valid academic ranges. Invalid values were removed instead of clipped. Prediction-time clipping is reported separately because regressors can occasionally predict slightly outside 0-100.

## Statistical Summary

| feature | count | mean | std | min | 25% | 50% | 75% | max | median |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| attendance_pct | 9840 | 75.0414 | 12.4149 | 40 | 66.7 | 75.4 | 84 | 100 | 75.4 |
| study_hours_week | 9708 | 15.879 | 7.86763 | 1.97 | 10.2 | 15.7 | 21.2 | 40 | 15.7 |
| assignment_score | 9650 | 69.951 | 14.8322 | 30 | 59.8 | 70.8 | 80.875 | 100 | 70.8 |
| internal_marks | 9880 | 64.5739 | 16.0245 | 30 | 53.7 | 65.3 | 75.9 | 100 | 65.3 |
| prev_sem_cgpa | 9605 | 7.1652 | 1.38548 | 4 | 6.17 | 7.16 | 8.24 | 10 | 7.16 |
| activity_score | 9657 | 58.7601 | 15.3723 | 0 | 48.3 | 59 | 69.5 | 100 | 59 |
| final_exam_marks | 10097 | 68.3502 | 18.4088 | 0 | 56.58 | 69.9 | 81.57 | 100 | 69.9 |

## EDA

- Plot files generated: 21 in `artifacts\plots`.
- Target mean: 68.350
- Target median: 69.900
- Target standard deviation: 18.409
- Target minimum: 0.000
- Target maximum: 100.000
- Target skewness: -0.429
- Strongest absolute correlations with `final_exam_marks`: {'internal_marks': 0.822, 'assignment_score': 0.782, 'prev_sem_cgpa': 0.766, 'study_hours_week': 0.708, 'attendance_pct': 0.705, 'activity_score': 0.637}
- Signed correlations with `final_exam_marks`: {'internal_marks': 0.822, 'assignment_score': 0.782, 'prev_sem_cgpa': 0.766, 'study_hours_week': 0.708, 'attendance_pct': 0.705, 'activity_score': 0.637}

Correlation describes association only; it does not prove causation.

## Outliers

| feature | lower_bound | upper_bound | iqr_outliers |
| --- | --- | --- | --- |
| attendance_pct | 40.75 | 109.95 | 33 |
| study_hours_week | -6.3 | 37.7 | 40 |
| assignment_score | 28.1875 | 112.488 | 0 |
| internal_marks | 20.4 | 109.2 | 0 |
| prev_sem_cgpa | 3.065 | 11.345 | 0 |
| activity_score | 16.5 | 101.3 | 31 |
| final_exam_marks | 19.095 | 119.055 | 65 |

Outliers identified by IQR were treated as rare-but-possible observations unless they violated domain ranges. They were not removed simply to improve model performance.

## Leakage Prevention

The model uses only information plausibly available before the final exam. `final_exam_marks` is separated before modeling and is never included in preprocessing for input features. All imputers and scalers are fitted inside Scikit-learn pipelines using training folds only.

## Models

- Dummy Regressor: baseline that predicts the training-set mean.
- Linear Regression: interpretable linear benchmark.
- Decision Tree: nonlinear baseline, but can overfit.
- Random Forest: bagged tree ensemble suitable for tabular data.
- Gradient Boosting: sequential ensemble that can model nonlinear structure.
- XGBoost was skipped because `xgboost` is not installed. Install with `pip install xgboost` to include it.

## Test Results

| model | mae | mse | rmse | r2 | train_r2 |
| --- | --- | --- | --- | --- | --- |
| Gradient Boosting | 6.245 | 63.126 | 7.945 | 0.821 | 0.831 |
| Linear Regression | 6.362 | 65.663 | 8.103 | 0.814 | 0.806 |
| Random Forest | 6.453 | 67.394 | 8.209 | 0.809 | 0.971 |
| Decision Tree | 8.861 | 130.340 | 11.417 | 0.630 | 1.000 |
| Dummy Regressor | 14.962 | 353.137 | 18.792 | -0.002 | 0.000 |

### How To Read The Metrics

- MAE means Mean Absolute Error. It is the average prediction mistake in marks. Lower is better. MAE = 6 means the model is usually off by about 6 marks.
- MSE means Mean Squared Error. It squares mistakes, so big mistakes are punished more strongly. Lower is better.
- RMSE means Root Mean Squared Error. It is also in marks, like MAE, but it reacts more to large errors. Lower is better.
- R2 explains how much target variation the model captures compared with predicting the average mark. Higher is better, but R2 is not an accuracy percentage.
- train_r2 shows performance on training data. If train_r2 is much higher than test R2, the model may be overfitting.

### Why Models Performed Differently

- Best test model: Gradient Boosting with MAE 6.245, RMSE 7.945, and R2 0.821. It gives the lowest error on unseen test data.
- Highest-error model: Dummy Regressor with MAE 14.962. This is expected when the model is too simple or ignores useful feature patterns.
- Gradient Boosting performs well because it builds many small trees one after another. Each tree tries to fix previous mistakes, so it captures nonlinear patterns without memorizing the data too much. Here its train R2 (0.831) and test R2 (0.821) are close, which is a good sign.
- Linear Regression is strong because the features have clear positive relationships with final marks. Its MAE (6.362) is close to the best model, so much of the dataset pattern is approximately linear.
- Random Forest has low test error, but its train R2 (0.971) is much higher than test R2 (0.809). That means it learned training data very strongly and may overfit a little.
- Decision Tree has train R2 (1.000) but weaker test R2 (0.630). A single deep tree can memorize training rows, so it often gives higher error on new students.
- Dummy Regressor predicts the average mark for everyone. Its high MAE (14.962) shows the real ML models are learning useful information from the features.

## Cross Validation

| model | cv_mae_mean | cv_mae_std | cv_rmse_mean | cv_rmse_std | cv_r2_mean | cv_r2_std |
| --- | --- | --- | --- | --- | --- | --- |
| Gradient Boosting | 6.315 | 0.137 | 7.990 | 0.107 | 0.810 | 0.004 |
| Linear Regression | 6.373 | 0.118 | 8.066 | 0.112 | 0.806 | 0.004 |
| Random Forest | 6.415 | 0.126 | 8.121 | 0.136 | 0.803 | 0.005 |
| Decision Tree | 8.942 | 0.107 | 11.391 | 0.101 | 0.613 | 0.010 |
| Dummy Regressor | 14.708 | 0.038 | 18.313 | 0.145 | -0.001 | 0.000 |

Five-fold cross-validation trains and validates the model five times using different splits of the training data. This is more reliable than trusting one split only. The best average CV model was Gradient Boosting with CV MAE 6.315 +/- 0.137. A small standard deviation means performance is stable across folds. The final test set was still kept separate until final evaluation.

## Hyperparameter Tuning

RandomizedSearchCV tested 6 Gradient Boosting combinations and 2 Random Forest combinations using cross-validation on the training data only.

| model | best_cv_mae | best_params |
| --- | --- | --- |
| Random Forest Tuned | 6.29257 | {'model__n_estimators': 60, 'model__min_samples_split': 10, 'model__min_samples_leaf': 1, 'model__max_features': 'sqrt', 'model__max_depth': 10} |
| Gradient Boosting Tuned | 6.32596 | {'model__subsample': 0.95, 'model__n_estimators': 150, 'model__min_samples_split': 10, 'model__min_samples_leaf': 3, 'model__max_depth': 4, 'model__learning_rate': 0.03} |

Tuned model test performance:

| model | mae | mse | rmse | r2 | train_r2 |
| --- | --- | --- | --- | --- | --- |
| Random Forest Tuned | 6.263 | 62.750 | 7.921 | 0.822 | 0.878 |
| Gradient Boosting Tuned | 6.265 | 62.953 | 7.934 | 0.821 | 0.834 |

## Feature Engineering Experiment

| feature_set | cv_mae_mean | cv_mae_std |
| --- | --- | --- |
| Original features | 6.344 | 0.133 |
| Original + engineered features | 6.295 | 0.098 |

Engineered features were not automatically added to the final model.

## Final Model

- Selected model: Gradient Boosting
- Saved pipeline: `artifacts\final_model.pkl`
- Selection rationale: Gradient Boosting had the best balanced final-test ranking by MAE/RMSE/R2 among the evaluated candidates. Cross-validation was used before final test evaluation to reduce reliance on a single split. Its untuned family CV MAE was 6.315 +/- 0.137.

Overfitting was checked by comparing train R2 and test R2. Selection did not rely on training score alone.

## Explainability

Model-native feature importance from the final tree-based estimator.

| feature | importance |
| --- | --- |
| internal_marks | 0.52626 |
| prev_sem_cgpa | 0.180939 |
| assignment_score | 0.140967 |
| study_hours_week | 0.0769131 |
| attendance_pct | 0.0565849 |
| activity_score | 0.0183358 |

SHAP was not computed because `shap` is unavailable or the final estimator is not tree-based. Install with `pip install shap` for SHAP explanations.



Feature importance and SHAP-style contributions describe model behavior, not causal effects.

## Prediction Example

Input: attendance=90, study hours=15, assignment=85, internal=80, previous CGPA=8.2, activity=84.

```json
{
  "raw_prediction": 83.18578949757803,
  "predicted_final_marks": 83.18578949757803,
  "was_clipped_to_valid_range": false
}
```

If a raw regression prediction falls outside 0-100, the returned prediction is clipped to the valid range and `was_clipped_to_valid_range` is set to true.

## Reproducibility

- Dataset version: `student_marks_dataset_dirty.csv` loaded from the working directory.
- Random state: 42
- Train/test ratio: 80/20
- Cross-validation folds: 5
- Preprocessing: median imputation for numeric inputs; StandardScaler only for scaled linear pipeline.
- Metrics: MAE, MSE, RMSE, R2.

## Limitations

- Dataset quality limits model quality; missing and duplicate records were handled conservatively.
- If this dataset is synthetic, performance may not represent real student outcomes.
- Predictions have uncertainty and should not be used as the sole basis for academic decisions.
- Correlation and feature importance do not imply causation.
- Performance may change on future or real-world student data.
