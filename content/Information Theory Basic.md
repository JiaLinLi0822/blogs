## Information Theory Basic

### Shannon Information

Claude Shannon: A mathematical Theory of Communication(1948)

Consder a discrete random variable X, Shannon information content for outcome $X=x$
$$
h(X = x) = log_2 \frac{1}{P(X=x)}= -log_2P(X=x)
$$
For continuous random variable X, we use natural log, which is
$$
h(X = x) = ln \frac{1}{P(X=x)}= -lnP(X=x)
$$

#### Desiderata in measuring information

1. **Deterministic outcomes($P(X=x)$) contain no information**

$$
h(X=x) = log_2 \frac{1}{P(X=x)}= log_2 \frac{1}{1} = 0
$$

2. **Information content increases with decreasing probability.**

Let's take a look at the derivative of the Shannon information:
$$
\frac{d}{dp}log_2\frac{1}{p}=-\frac{1}{pln2}<0
$$
Thus
$$
P(X=x)<P(X=x') \rightarrow h(X=x)>h(X=x')
$$

3. **Information content is additive for independent R.V.s**

$$
h(X=x, Y=y)=log_2 \frac{1}{P(X=x)P(Y=y)}=log_2\frac{1}{P(X=x)}+log_2\frac{1}{P(Y=y)}=h(X=x)+h(Y=y)
$$

### Shannon entropy

Shannon entropy measure the average information content. Shannon entropy is maximized when the probability distribution is uniform, where it has largest uncertainty in every possible outcomes.
$$
\begin{aligned}
H(X)&=\sum_{x\in X}P(X=x)h(X=x) \\
&=\sum_{x\in X}P(X=x)log_2 \frac{1}{P(X=x)} \\
&=-\sum_{x\in X}P(X=x)log_2 P(X=x)
\end{aligned}
$$
##### Joint entropy: multivatiate generalization of Shannon entropy

$$
H(X,Y)=\sum_{x\in X}\sum_{y\in Y}P(X=x,Y=y)log_2\frac{1}{P(X=x, Y=y)}
$$

##### Entropy of the conditional distribution:

$$
H(X|Y=y)=\sum_{x\in X}P(X=x|Y=y)log_2\frac{1}{P(X=x|Y=y)}
$$

##### Conditional entropy

How much randomness X has once you factor out the knowledge of Y
$$
\begin{aligned}
H(X|Y)&=\sum_{y\in Y}P(Y=y)H(X|Y=y)\\
&= \sum_{y\in Y}P(Y=y)\sum_{x\in X}P(X=x|Y=y)log_2\frac{1}{P(X=x|Y=y)}\\
&= \sum_{y\in Y}\sum_{x\in X}P(X=x,Y=y)log_2\frac{1}{P(X=x|Y=y)}
\end{aligned}
$$

###### Properties of conditional entropy

1. Joint entropy of $X$ and $Y$ decomposes into the conditional entropy of X given Y and the marginal entropy of Y

$$
H(X,Y)=H(X|Y)+H(Y)
$$

$$
H(X,Y)=H(Y|X)+H(X)
$$

2. The conditional entropy of $X$ given $Y$ is zero if $X$ is completely determined by $Y$ in a deterministic way

$$
H(X|Y)=0 \ \text{if deterministic}
$$

3. The conditional entropy of $X$ given $Y$ is equal to the marginal entropy of X if there is no connection between $X$ and $Y$

$$
H(X|Y)=H(X) \ \text{if independent}
$$

##### Relative entropy: Kullback-Leibler divergence

A useful measure of difference between two distributions. Take P and Q to be the PMFs of two distributions
$$
D_{KL}(P||Q)=\sum_{x\in X}P(x)log_2\frac{P(x)}{Q(x)}
$$

###### Properties of KL Divergence:

1. $$
   D_{KL}(P||Q)\geq 0
   $$

2. $$
   D_{KL}(P||Q)= 0 \ \text{only if P=Q}
   $$

3. $$
   D_{KL}(P||Q) \neq D_{KL}(Q||P) \ \text{since not symmetric}
   $$

##### Mutual information: general measure of dependence

$$
\begin{aligned}
I(X;Y)&=D_{KL}(P(x,y)||P(x)P(y))\\
&=\sum_{x\in X}\sum_{y\in Y}P(x,y)log_2\frac{P(x,y)}{P(x)P(y)}\\
&=H(X)-H(X|Y)=H(Y)-H(Y|X)\\
&=H(X,Y)-H(X|Y)-H(Y|X)
\end{aligned}
$$

