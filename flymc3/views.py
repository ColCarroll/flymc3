from flask import render_template, jsonify, request
import pymc3 as pm

from flymc3 import app
from flymc3.models import flip_coins


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/flip_coins')
def coin_flip_route():
    draws = max(1, min(10000, int(request.args.get('draws', 500))))
    alpha = max(0.01, float(request.args.get('alpha', 1)))
    beta = max(0.01, float(request.args.get('beta', 1)))
    tails = max(0, float(request.args.get('tails', 100)))
    heads = max(0, float(request.args.get('heads', 100)))
    with flip_coins(alpha, beta, tails, heads):
        trace = pm.sample(draws)
    return jsonify(pm.trace_to_dataframe(trace).to_dict(orient='records'))
