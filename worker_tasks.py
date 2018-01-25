import os
import redis
import datetime as dt

REDISCLOUD_URL = os.environ['REDISCLOUD_URL']
REDIS_CHAN = 'chat'
redis = redis.from_url(REDISCLOUD_URL)
start_time = dt.datetime.now()
interval = 10 # seconds

def publish(text):
    message = '{ "handle": "worker", "text": "' + text + '" }'
    redis.publish(REDIS_CHAN, message)

def print_time():
    t = dt.datetime.now()
    i = 1

    while True:
      delta=dt.datetime.now()-t
      if delta.seconds >= interval:
         text = str(i) + " x " + str(interval) + " sec from " + str(start_time)
         publish(text)
         i += 1
         t = dt.datetime.now()