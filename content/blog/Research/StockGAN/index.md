---
title: Generating Realistic Stock Market Order Streams - A Summary
author: Deepak
tags: [research, notes-and-summaries]
date: "2021-05-29"
thumbnail: ./images/dal.jpg
description: A summary of StockGANs - a market data simulator.
---

## Terminologies and Pre-requisite knowledge
* [Generative Adversarial Networks(GAN)](https://arxiv.org/abs/1406.2661)
* [Wasserstein GAN](https://arxiv.org/abs/1701.07875)
* Limit order - the maximum price at which a trader would be willing to buy a specified quantity of a stock, or the minimum price at which they  ould be willing to sell a quantity.
* Best bid - the lowest buy price level.
* Best ask - the highest sell price level.


## Introduction
* Quant research and strategy development rely on orderbook and tradebook data of financial instruments to backtest and gauge the performance of a strategy.
* This paper aims to develop a simulator capable of producing market data at high fidelity and high realism, by learning a generator from real stock market data streams.
* The primary contribution is the architecture and formulation of Stock-GAN, a conditional GAN model based on Wasserstein GAN (WGAN) to produce realistic stock market order streams from real market data.
* Next contribution is the mathematical characterization of the distribution learned by the generator, which is modeled as a stochastic process with finite memory dependency.
* The generated data streams are evaluated based on the distributions of five parameters.


## Architecture and Mathematical characterization
* Notation _X_ :  vector valued random variable, whose components include the time interval in between orders, type of order, limit order price, limit order quantity and the best bid and best ask prices.
* A conditional WGAN with both the generator and critic conditioned on a _k_ length history of _X_ and the time interval _Δt_ is used for the architecture. _k_ = 20 is the chosen value.
*  The history is condensed to one vector using a single LSTM layer. This vector and uniform noise of dimension 100 is fed to a fully connected layer followed by 4 convolution layers.
* When the generator executes after training it is fed its own generated data as history.
* **Stock-GAN novel architectural features**
    1. A separate neural network (CDA network) that is used to approximate the double auction mechanism underlying stock exchanges. It consists of a fully connected layer followed by 3 convolutional layers. Its input is a limit order and the current best bid and best ask and the output is the next best bid and best ask. This network is trained separately using the orders and order-book data using a standard mean squared error loss.
    2. Inclusion of order-book information in the conditioning history of the network. The _k_ length history implies a finite history dependence of the current output _x<sub>i</sub>_ i.e. P(x<sub>i</sub> | x<sub>i−1</sub> , ... , Δt) = P(x<sub>i</sub> | x<sub>i−1</sub> , ... , x<sub>i−m</sub> , Δt) for some _m_ which is modelled as a higher order Markov Chain. As the modelled stochastic process cannot be described in a closed form, a neural network is used to learn this complex stochastic process.
* **Mathematical interpretations**
    1. The critic computes the Wasserstein distance between the joint distributions P<sub>r</sub>(x<sub>i</sub>, ... , x<sub>i−k</sub>, Δt) and P<sub>g</sub>(x<sub>i</sub>, ... , x<sub>i−k</sub> , Δt).
    2. The generator represents the distribution P<sub>g</sub>(x<sub>i</sub>, ... , x<sub>i−k</sub> , Δt) = P<sub>g</sub> (x<sub>i</sub> | x<sub>i−1</sub> , ... , x<sub>i−k</sub> , Δt)P<sub>r</sub>(x<sub>i−1</sub> , ... , x<sub>i−k</sub> , Δt), where subscript _r_ denotes distributions on real data and _g_ denotes distributions on generated data.

![](./images/StockGAN.png)

## Evaluation
The five proposed statistics to evaluate the fidelity of generated data are :
1. Price: Distribution over price for the day’s limit orders, by order type.
2. Quantity: Distribution over quantity for the day’s limit orders, by order type.
3. Inter-arrival time: Distribution over inter-arrival duratio for the day’s limit orders, by order type.
4. Intensity evolution: Number of orders for consecutive T-second chunks of time.
5. Best bid/ask evolution: Changes in the best bid and ask over time as new orders arrive.

* The baseline distributions are generated using Variational Autoencoders and Deep Conditional GANs. The evaluation statistic used is Kolmogorov-Smirnoff distance.
* Ablation studies were performed by removing CDA network and orderbook information. Removing these two features lead to fewer high frequency components in comparison to synthetic data. Removing the CDA network leads to more high frequency components in comparison to real data.

## Limitations
* The time intervals chosen are for shorter durations only which can capture regular movements over a short interval. Accordingly, the evaluation data chosen is exclusive of external factors such as quarterly or annual financial performance reports. 

## Paper and Code
* [Paper](https://ojs.aaai.org//index.php/AAAI/article/view/5415)
* [Code Snippets](https://openreview.net/pdf?id=rke41hC5Km)
