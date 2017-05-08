import requests
import json
import requests.auth
from flask import Flask, url_for, render_template, abort, request, redirect
from secret import client_s
app = Flask(__name__, template_folder="./public", static_folder="./src")

CLIENT_ID = "QlVnptrGQ1egA1SeKkq7x2P9T6L44jRUKusVBVldR6py6jNvjj"
REDIRECT_URI = "http://localhost:5000/inshape_callback"
CLIENT_SECRET = client_s


def test_access():
    with open('data.txt') as f:
        data = f.read()
    access = data[1:-1]
    headers = {"Authorization": "bearer " + access}
    response = requests.get("https://api.shapeways.com/api/v1", headers=headers)
    response_json = json.loads(response.text)
    result = response_json['result']
    return result


def get_access():
    with open('data.txt') as f:
        data = f.read()
    access = data[1:-1]
    return access


@app.route('/')
@app.route('/index')
def welcome():
    access = test_access()
    if access == "success":
        return redirect(url_for('home'))
    else:
        return redirect(url_for('inshape_connect'))


@app.route('/home')
def home():
    test_access()
    return render_template('home.html')


@app.route('/inshape')
def inshape_connect():
    text = '<a href="%s">Authorize!</a>'
    return text % make_authorization_url()


def make_authorization_url():
    from uuid import uuid4
    state = str(uuid4())
    save_created_state(state)
    params = {"client_id": CLIENT_ID,
              "response_type": "code",
              "state": state,
              "redirect_uri": REDIRECT_URI,
              "duration": "temporary",
              "scope": "identity"}
    import urllib
    url = "http://api.shapeways.com/oauth2/authorize?" + urllib.urlencode(params)
    return url


def save_created_state(state):
    pass


def is_valid_state(state):
    return True


@app.route('/inshape_callback')
def inshape_callback():
    error = request.args.get('error', '')
    if error:
        return "Error: " + error
    state = request.args.get('state', '')
    if not is_valid_state(state):
        abort(403)
    code = request.args.get('code')
    access_token = get_token(code)
    with open('data.txt', 'w') as outfile:
        json.dump(access_token, outfile)
    return redirect(url_for('home'))


def get_token(code):
    client_auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    post_data = {"grant_type": "authorization_code",
                 "code": code,
                 "redirect_uri": REDIRECT_URI}
    responce = requests.post('https://api.shapeways.com/oauth2/token',
                             auth=client_auth,
                             data=post_data)
    token_json = responce.json()
    a_token = token_json['access_token']
    return a_token


@app.route('/manufacturers', methods=['POST', 'GET'])
def get_manufacturers():
    access_token = get_access()
    headers = {"Authorization": "bearer " + access_token}
    response = requests.get("https://api.shapeways.com/manufacturers/v1", headers=headers)
    manufacturers_json = json.loads(response.text)
    man_list = str(manufacturers_json)
    return render_template('manufacturers.html', manufacturers=man_list)


@app.route('/react')
def react_test():
    render_template('index.html')
