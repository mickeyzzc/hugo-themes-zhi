---
title: "Math Test"
date: 2024-04-01
categories: ["test"]
tags: ["math", "test"]
description: "MathJax rendering test with inline and display equations"
---

## Inline Math

The famous mass-energy equivalence: $E = mc^2$. The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

Euler's identity is often considered the most beautiful equation in mathematics: $e^{i\pi} + 1 = 0$.

The normal distribution probability density function: $f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$.

## Display Math

The Gaussian integral:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

Maxwell's equations in differential form:

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$

$$
\nabla \cdot \mathbf{B} = 0
$$

$$
\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}
$$

$$
\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
$$

## Matrices

A 3x3 identity matrix:

$$
\mathbf{I}_3 = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}
$$

Matrix multiplication:

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} e \\ f \end{bmatrix} = \begin{bmatrix} ae + bf \\ ce + df \end{bmatrix}
$$

## Aligned Equations

$$
\begin{aligned}
\nabla \times \mathbf{F} &= \left( \frac{\partial F_z}{\partial y} - \frac{\partial F_y}{\partial z} \right) \mathbf{i} \\
&\quad + \left( \frac{\partial F_x}{\partial z} - \frac{\partial F_z}{\partial x} \right) \mathbf{j} \\
&\quad + \left( \frac{\partial F_y}{\partial x} - \frac{\partial F_x}{\partial y} \right) \mathbf{k}
\end{aligned}
$$

## Summation and Products

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} x_i = x_1 \cdot x_2 \cdot \ldots \cdot x_n
$$

## Greek Letters

$$
\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho, \sigma, \tau, \upsilon, \phi, \chi, \psi, \omega
$$

$$
\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Phi, \Psi, \Omega
$$

## Mixed Inline and Display

Bayes' theorem states that $P(A|B) = \frac{P(B|A) P(A)}{P(B)}$. In the context of machine learning, we can express the posterior as:

$$
P(\theta | \mathcal{D}) = \frac{P(\mathcal{D} | \theta) P(\theta)}{P(\mathcal{D})}
$$

where $P(\theta | \mathcal{D})$ is the posterior, $P(\mathcal{D} | \theta)$ is the likelihood, $P(\theta)$ is the prior, and $P(\mathcal{D})$ is the evidence.
