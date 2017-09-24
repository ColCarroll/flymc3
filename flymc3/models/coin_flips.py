import pymc3 as pm


def flip_coins(alpha, beta, tails, heads):
    with pm.Model() as model:
        p = pm.Beta('p', alpha=alpha, beta=beta)
        pm.Binomial('outcome', n=heads+tails, p=p, observed=heads)
    return model
