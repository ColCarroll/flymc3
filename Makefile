all: run

clean:
	rm -rf *.egg-info && rm -rf dist && rm -rf *.log*

venv:
	source ~/.venv/flymc3/bin/activate && ~/.venv/flymc3/bin/python setup.py develop

run: venv
	FLASK_APP=flymc3 FLYMC3_SETTINGS=../settings.cfg ~/.venv/flymc3/bin/flask run

test: venv
	FLYMC3_SETTINGS=../settings.cfg venv/bin/python -m unittest discover -s tests

sdist: venv test
	~/.venv/flymc3/bin/python setup.py sdist
