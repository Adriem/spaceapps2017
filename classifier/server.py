from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Demo endpoint
@app.route('/')
def demo():
    return 'It lives!!'


# Start the server
def start():
    app.run(host='0.0.0.0', port=5000, debug=True)


# Stop the server
def stop():
    # Do nothing
    return
