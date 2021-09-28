FROM python

ADD . /app
RUN pip install -r /app/requirements.txt
WORKDIR /app

EXPOSE 5480

CMD /app/app.py --host=0.0.0.0 --port=5480



