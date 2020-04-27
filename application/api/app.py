import os
import uuid

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

import common
import service

app = Flask(__name__)
cors = CORS(app)

app.config['UPLOAD_FOLDER'] = 'upload'
app.config['STATIC_FOLDER'] = 'static'


def is_file_allowed(filename: str):
    return filename.endswith('.txt')


@app.route('/api/summary', methods=['POST'])
@cross_origin()
def text_rank_summary():
    keywords_n = 3
    sentences_n = 2
    try:
        keywords_n = int(request.args.get('keywords'))
        sentences_n = int(request.args.get('sentences'))
    except Exception:
        pass
    if 'file' in request.files:
        file = request.files['file']
        filename = secure_filename(file.filename)
        if file and is_file_allowed(filename):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], str(uuid.uuid1()))
            file.save(filepath)
            obj = service.process_file(filepath, keywords_n, sentences_n)
            os.remove(filepath)
            return obj
    response = jsonify({"error": "invalid file was supplied"})
    response.status_code = 400
    return response


@app.route('/api/documents', methods=['GET'])
@cross_origin()
def get_all_documents():
    return common.get_not_train()


if __name__ == '__main__':
    app.run(host='0.0.0.0')
