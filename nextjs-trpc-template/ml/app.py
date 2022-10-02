import os
import urllib.request

import numpy as np
import PIL.Image as Image
import tensorflow as tf
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app,origins="*",methods=["GET","POST"],allow_headers=["Content-Type"])


def load_model():
    model = tf.keras.models.load_model("model")
    return model


def get_data(data):
    urllib.request.urlretrieve(data["image1"], "temp/passport.jpg")
    urllib.request.urlretrieve(data["image2"], "temp/image.jpg")
    im1 = Image.open("temp/passport.jpg")
    im2 = Image.open("temp/image.jpg")
    im1 = im1.resize((128, 128))
    im2 = im2.resize((128, 128))
    im1 = np.array(im1)
    im2 = np.array(im2)
    con = np.concatenate((im1, im2), axis=1)
    con = np.expand_dims(con, axis=0)
    return con


@app.route("/", methods=["POST", "GET"])
def index():
    
    if request.method == "GET":
        return "Welcome to the ML API"
    
    data = request.get_json()
    model = load_model()

    if model == None:
        return "Model not loaded"

    else:
        if data == None:
            return "No data"

        con = get_data(data)
        
        pred = model.predict(con)

        os.remove("temp/passport.jpg")
        os.remove("temp/image.jpg")

    return str(pred)


app.run(port=3001, debug=True)
