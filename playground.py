from flask import Flask, redirect, url_for, session, request
from flask_oauthlib.client import OAuth, OAuthException
from secret import client_s

CLIENT_ID = "QlVnptrGQ1egA1SeKkq7x2P9T6L44jRUKusVBVldR6py6jNvjj"
CLIENT_SECRET = client_s


app = Flask(__name__)
app.debug = True
app.secret_key = 'development'
oauth = OAuth(app)

shapeways = oauth.remote_app(
    'shapeways',
    consumer_key=CLIENT_ID,
    consumer_secret=CLIENT_SECRET,
    redirect_uri="http://localhost:5000/inshape_callback",
    base_url='https://api.shapeways.com',
    request_token_url=None,
    access_token_url='/oauth2/token',
    access_token_method='GET',
    authorize_url='https://api.shapeways.com/oauth2/authorize'
)


@app.route('/')
def index():
    return redirect(url_for('login'))


@app.route('/login')
def login():
    callback = url_for(
        'shapeways_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True
    )
    return shapeways.authorize(callback=callback)


@app.route('/inshape_callback')
def shapeways_authorized():
    resp = shapeways.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    if isinstance(resp, OAuthException):
        return 'Access denied: %s' % resp.message

    session['oauth_token'] = (resp['access_token'], '')
    code = shapeways.get('code')
    access_token = shapeways.get(code)
    return 'Logged in!'


@shapeways.tokengetter
def get_shapeways_oauth_token():
    return session.get('oauth_token')


if __name__ == '__main__':
    app.run()
