import inspect
from io import StringIO
import os
import re
import shutil
import tempfile

from docrepr import sphinxify
from flask import render_template, render_template_string, jsonify, request
from IPython.core.oinspect import Inspector
import pymc3 as pm

from flymc3 import app
from flymc3.models import flip_coins

HERE = os.path.abspath(os.path.dirname(__file__))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/coins')
def coins():
    return render_template('coins.html')

@app.route('/model')
def model():
    return render_template('model.html')


@app.route('/signature/<name>')
def signature(name):
     if name in pm.distributions.__all__:
        object_ = pm.distributions.__dict__[name]
        a = inspect.getfullargspec(object_.__init__)
        args = a.args[1:]
        if a.defaults is None:
            defaults = [None for _ in args]
        else:
            defaults = list(a.defaults)
            defaults = [None for _ in range(len(args) - len(defaults))] + defaults
        return jsonify(dict(zip(args, defaults)))
     else:
         return jsonify({})


def replacer(name):
    def sub_replacer(match):
        return "{{ url_for('static', filename='%s') }}" % os.path.join(name, match.group(0))
    return sub_replacer


@app.route('/documentation/<name>')
def documentation(name):
    if name in pm.distributions.__all__:
        object_ = pm.distributions.__dict__[name]
        o = Inspector().info(object_)
        with tempfile.TemporaryDirectory(prefix=name) as tmp:
            html = sphinxify.sphinxify(o['docstring'], tmp)
            html = re.sub(r'_images/.*?\.png', replacer(name), html)
            dest = os.path.join(HERE, 'static', name)
            if not os.path.isdir(dest):
                shutil.copytree(tmp, dest)
        return render_template_string(html)
    else:
        return render_template_string('<p>Not Found!')


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


@app.route('/distributions')
def distributions_route():
    return jsonify({
        'Continuous': pm.distributions.continuous.__all__,
        'Discrete': pm.distributions.discrete.__all__,
        'Timeseries': pm.distributions.timeseries.__all__,
    })
