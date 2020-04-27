FROM continuumio/miniconda3

COPY . /opt
WORKDIR /opt
RUN conda install --file requirements.txt && mkdir upload

CMD python app.py
