import json
import ast
import requests
from pprint import pprint

with open('data.txt', 'r') as data_file:
    data = data_file.read()
value = data[1:-1]
print value
