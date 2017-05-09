import json
import requests
from flask import Flask, redirect, url_for, session, request
from flask_oauthlib.client import OAuth, OAuthException
from secret import client_s

app = Flask(__name__, template_folder="./public", static_folder="./src")


@app.route('/')
def test_access():
    with open('data.txt') as f:
        data = f.read()
    access = data[1:-1]
    headers = {"Authorization": "bearer " + access}
    response = requests.get("https://api.shapeways.com/api/v1", headers=headers)
    response_json = json.loads(response.text)
    result = response_json['result']
    return str(result)


if __name__ == '__main__':
    app.run()
