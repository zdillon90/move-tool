import json
import requests
from flask import Flask

app = Flask(__name__, template_folder="./public", static_folder="./src")


@app.route('/')
def test_access():
    with open('data.json') as data_file:
        data = json.load(data_file)
    access = data['access_token']
    headers = {"Authorization": "bearer " + access}
    response = requests.get("https://api.shapeways.com/materials/v1", headers=headers)
    response_json = json.loads(response.text)
    result = response_json
    with open('test.json', 'w') as test_file:
        json.dump(response_json, test_file)
    return result


if __name__ == '__main__':
    app.run()
