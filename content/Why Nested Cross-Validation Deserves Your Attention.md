---
title: "Why Nested Cross-Validation Deserves Your Attention"
source: "https://medium.com/@pacosun/nested-cross-validation-your-weapon-against-overfitting-17401c851593"
author:
  - "[[Paco Sun]]"
published: 2025-05-02
created: 2026-07-15
description: "If you’ve been working with ML for a bit, chances are you’re familiar with k-fold cross-validation. In a previous article, we walked through"
tags:
  - "clippings"
---
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kl7Sv09eO20wi6Vdgydifg.png)

If you’ve been working with ML for a bit, chances are you’re familiar with [**k-fold cross-validation**](https://medium.com/@pacosun/cross-validation-techniques-ensuring-your-model-generalizes-well-2f5b4f58be0f). In a previous article, we walked through how standard k-fold helps estimate generalization performance more reliably than a single train/test split.

But as soon as we introduce [**hyperparameter tuning**](https://medium.com/@pacosun/the-art-of-hyperparameter-tuning-making-your-models-less-dumb-more-brilliant-9699fe5358d0), standard cross-validation can start lying because the moment we use our validation folds to both **choose the best model** and **report its performance**, we risk overfitting.

## The Limitations of Standard Cross-Validation

Standard k-fold is great for estimating how well a model might perform on unseen data if we’re evaluating a fixed model with fixed hyperparameters.

But the problem is that most real-world workflows don’t train a single model. Instead, we search for the best model by tuning hyperparameters.

Here’s a common (but flawed) pattern:

```c
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)

# Tune hyperparameters using CV
pipe = make_pipeline(StandardScaler(), LogisticRegression())
param_grid = {'logisticregression__C': [0.1, 1, 10]}
grid = GridSearchCV(pipe, param_grid, cv=5)
grid.fit(X, y)

# Now evaluate best model using CV again
scores = cross_val_score(grid.best_estimator_, X, y, cv=5)
print("CV score:", scores.mean())
```

Output:

```c
CV score: 0.9806862288464524
```

Looks good for sure. But there’s an issue:

We’ve used the same cross-validation logic both to select the best model and to estimate its performance.

That means the model we’re evaluating (`grid.best_estimator_`) was already kind of informed by the full dataset during tuning. This can cause **data leakage**, which then leads to overfitting and a biased score.

We need a way to separate the process of choosing the best model from the process of evaluating its performance.

## Nested Cross-Validation

To avoid misleading ourselves with good scores, we need to split our workflow into two distinct stages:

- **Model selection** (choosing the best hyperparameters or model type)
- **Model evaluation** (estimating how well the final model will generalize)

There are two loops of nested cross-validation:

- **Outer loop (evaluation):** This is the honesty test. For each fold, we hold out a chunk of data to evaluate the performance of the model **after** it has been tuned
- **Inner loop (selection):** Within the training data from the outer loop, we perform another cross-validation to tune hyperparameters

This way, each performance score from the outer loop is based on data the model never saw during tuning.

```c
from sklearn.model_selection import GridSearchCV, cross_val_score, KFold
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_breast_cancer

X, y = load_breast_cancer(return_X_y=True)

# Inner loop: grid search for hyperparameter tuning
pipe = make_pipeline(StandardScaler(), LogisticRegression())
param_grid = {'logisticregression__C': [0.1, 1, 10]}
inner_cv = KFold(n_splits=3, shuffle=True, random_state=1)
grid = GridSearchCV(pipe, param_grid, cv=inner_cv)

# Outer loop: evaluate generalization performance
outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)
nested_scores = cross_val_score(grid, X, y, cv=outer_cv)

print("Nested CV score:", nested_scores.mean())
```

Output:

```c
Nested CV Score: 0.9771308802980903
```

This might look almost identical to a standard cross-validation setup, but now the `GridSearchCV` is being treated as a **model object** inside `cross_val_score`.

That’s the key: every outer fold gets its own hyperparameter search using only the training data from that fold.

Each outer fold now gives a performance estimate of a model that was tuned without any access to the outer test data.

## A Walkthrough

Let’s make it less abstract. Imagine we now have a dataset and we want to:

- Tune a model using different hyperparameters
- Estimate how well that tuned model performs on unseen data

Let’s say we’re doing:

- Outer 5-fold cross-validation
- Inner 3-fold cross-validation

That means for each of the 5 outer folds, we’re going to:

1. Split the data into training (80%) and test (20%)
2. Use only the training portion to run a full 3-fold cross-validation (inner loop) to pick the best hyperparameters
3. Train the model with the best hyperparameters on the inner training data
4. Evaluate it on the outer test fold

### What we get in return:

- 5 completely independent model evaluations
- Each one includes a full hyperparameter search on data **excluding** the outer test fold
- The final score is the **average of these outer test scores**

## Why Nested Cross-Validation Is More Reliable

Standard cross-validation often gives a fake sense of security, especially if we’re tuning hyperparameters. It can look like our model is doing great.

## Get Paco Sun’s stories in your inbox

Join Medium for free to get updates from this writer.

Nested cross-validation avoids this trap by separating the model selection phase from the model evaluation phase. Each outer fold is an independent test of how well our training + tuning pipeline generalizes.

In addition:

- **No data leakage:** The model never sees the outer test data during tuning
- **Unbiased estimate:** Gives a realistic picture of how our full modelling process generalizes
- **More robust model comparison:** Nested cross-validation prevents us from favouring one just because it overfits the validation folds

## When (and When Not) to Use Nested CV

- **Comparing multiple models:** Trying out different algorithms? Use nested CV to avoid favouring the wrong one
- **Heavy hyperparameter tuning:** Nested CV is the safest way to get an unbiased performance estimate anytime we’re searching
- **Small dataset:** With fewer samples, the risk of overfitting is much higher. Nested CV provides extra protection

You probably don’t need it when:

- Model is being finalized for deployment
- **Quick prototyping:** Just use standard CV for speed in early exploration
- **Using CV inside an ensemble:** If you’re stacking models or blending CV-based predictions, nested CV may slow things down

If you’re only doing one or the other, standard CV might be enough.

## Example Code: Nested Cross-Validation in Python

In this section, we’ll:

- Use a simple pipeline( `StandardScaler` and `LogisticRegression` )
- Tune the `C` hyperparameter using grid search
- Perform 5-fold nested cross-validation
```c
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import GridSearchCV, cross_val_score, KFold
from sklearn.preprocessing import StandardScaler

# Load dataset
X, y = load_breast_cancer(return_X_y=True)

# Define preprocessing + model pipeline
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))

# Define hyperparameter grid for logistic regression
param_grid = {
    'logisticregression__C': [0.01, 0.1, 1, 10]
}

# Inner loop: GridSearchCV for hyperparameter tuning
inner_cv = KFold(n_splits=3, shuffle=True, random_state=1)
grid_search = GridSearchCV(pipe, param_grid, cv=inner_cv)

# Outer loop: cross_val_score to evaluate generalization performance
outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)
nested_scores = cross_val_score(grid_search, X, y, cv=outer_cv)

# Report average performance
print("Average nested CV score: %.3f" % nested_scores.mean())
```

Output:

```c
Average nested CV score: 0.977
```

What’s happening here is:

- `GridSearchCV` runs 3-fold CV on each split to select the best `C` value
- `cross_val_score` wraps the entire `GridSearchCV` object and runs 5-fold CV, holding out different test folds each time
- The model is tuned independently in each outer fold
- The final score is the average accuracy across the 5 outer test folds, which none of the tuned models ever saw during selection

Nested cross-validation avoids getting fooled by your own validation scores and helps you find models that are actually good on unseen data.

GLHF!