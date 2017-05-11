import json
import requests
from flask import Flask
from secret import client_s

app = Flask(__name__, template_folder="./public", static_folder="./src")

CLIENT_ID = "QlVnptrGQ1egA1SeKkq7x2P9T6L44jRUKusVBVldR6py6jNvjj"
CLIENT_SECRET = client_s

@app.route('/')
def test_access():
    with open('data.json') as data_file:
        data = json.load(data_file)
    access = data['access_token']
    headers = {"Authorization": "bearer " + access}
    response = requests.get("https://api.shapeways.com/materials/v1", headers=headers)
    response_json = json.loads(response.text)
    result = response_json
    with open('refresh.json', 'w') as test_file:
        json.dump(response_json, test_file)
    return result


def refresh():
    with open('data.json') as data_file:
        data = json.load(data_file)
    refresh_token = data['refresh_token']
    expire = data['expires_in']
    client_auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    post_data = {"grant_type": "refresh_token",
                 "refresh_token": "{r}".format(r=refresh_token),
                 "client_id": CLIENT_ID}
    responce = requests.post('https://api.shapeways.com/oauth2/token',
                             auth=client_auth,
                             data=post_data)
    data_json = responce.json()
    with open('data.json', 'w') as outfile:
        json.dump(data_json, outfile)


if __name__ == '__main__':
    app.run()
