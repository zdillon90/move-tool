import requests
import json
import requests.auth
from flask import Flask, url_for, render_template, abort, request, redirect, jsonify
from flask_cors import CORS
from secret import client_s
app = Flask(__name__, template_folder="./public", static_folder="./src")
CORS(app)

CLIENT_ID = "QlVnptrGQ1egA1SeKkq7x2P9T6L44jRUKusVBVldR6py6jNvjj"
REDIRECT_URI = "http://localhost:5000/inshape_callback"
CLIENT_SECRET = client_s


def read_data():
    with open('data.json') as data_file:
        data = json.load(data_file)
    return data


@app.route('/')
@app.route('/index')
def welcome():
    access = test_access()
    if access == "success":
        return redirect(url_for('home'))
    elif access == "Invalid Token Error":
        refresh()
        return redirect(url_for('home'))
    else:
        return redirect(url_for('inshape_connect'))


@app.route('/home')
def home():
    # test_access()
    return render_template('home.html')


def test_access():
    with open('data.json') as data_file:
        data = json.load(data_file)
    if 'access' not in data:
        redirect(url_for('inshape_connect'))
    else:
        access = data['access_token']
        headers = {"Authorization": "bearer " + access}
        response = requests.get("https://api.shapeways.com/materials/v1", headers=headers)
        if str(response) == "<Response [401]>":
            redirect(url_for('inshape_connect'))
        else:
            response_json = json.loads(response.text)
            result = response_json['result']
            return result


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
    with open('data.json', 'w') as outfile:
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
    return token_json


def refresh():
    with open('refresh.json', 'r') as input_file:
        data = json.load(input_file)
    refresh_token = data["refresh_token"]
    client_auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    post_data = {"grant_type": "refresh_token",
                 "refresh_token": "{r}".format(r=refresh_token),
                 "client_id": CLIENT_ID}
    response = requests.post('https://api.shapeways.com/oauth2/token',
                             auth=client_auth,
                             data=post_data)
    data_json = response.json()
    with open('refresh.json', 'w') as test_file:
        json.dump(data_json['refresh_token'], test_file)
    with open('data.json', 'w') as outfile:
        json.dump(data_json, outfile)


def json_reply(url):
    data = read_data()
    if 'error' in data:
        redirect(url_for('inshape_connect'))
    else:
        access_token = data['access_token']
        headers = {'Authorization': "bearer " + access_token}
        response = requests.get(url, headers=headers)
        json_data = json.loads(response.text)
        return jsonify(json_data)


@app.route('/manufacturers', methods=['POST', 'GET'])
def get_manufacturers():
    mans_url = "https://api.shapeways.com/manufacturers/v1"
    json_response = json_reply(mans_url)
    return json_response


@app.route('/manufacturer/<int:manufacturer_id>')
def sub_status(manufacturer_id):
    man_url = "https://api.shapeways.com/manufacturers/{m}/v1".format(m=manufacturer_id)
    json_response = json_reply(man_url)
    return json_response


@app.route('/production_trays/<int:manufacturer_id>')
def production_trays(manufacturer_id):
    pro_trays_url = "https://api.shapeways.com/production_trays/v1?manufacturer=13".format(m=manufacturer_id)
    json_response = json_reply(pro_trays_url)
    return json_response


@app.route('/production_orders?manufacturer=<int:manufacturer_id>&subStatuses<subStatuses_list>')
def production_orders(manufacturer_id, subStatus_list):
    url = "https://api.shapeways.com/production_orders/v1?manufacturer={m}&subStatus={s}".format(
        m=manufacturer_id, s=subStatus_list)
    json_response = json_reply(url)
    return json_response
