all: run

clean:
	rm -rf *.egg-info && rm -rf dist && rm -rf *.log*

run:
	FLASK_APP=flymc3 FLYMC3_SETTINGS=../settings.cfg flask run

test: 
	FLYMC3_SETTINGS=../settings.cfg python -m pytest tests

sdist:
	python setup.py sdist
