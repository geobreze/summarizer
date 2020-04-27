import re

import nltk
import pymongo
from bson.objectid import ObjectId
from nltk.corpus import stopwords
from pymongo.errors import DuplicateKeyError

nltk.download("stopwords")
nltk.download("wordnet")
lemmatizer = nltk.WordNetLemmatizer()
stop_words = stopwords.words('english')
MIN_WORD_LENGTH = 4
client = pymongo.MongoClient('mongodb://root:root@mongo:27017')
collection = client.texts.texts
collection.create_index("source", unique=True)


def get_not_train():
    return {"documents": [entry for entry in collection.find({"train": False})]}


def load_all_docs():
    return [item['words'] for item in collection.find()]


def save_to_db(text):
    text['_id'] = str(ObjectId())
    try:
        collection.insert_one(text)
    except DuplicateKeyError:
        print("already in db")


def is_stop_word(word):
    if word in stop_words:
        return True
    if len(word) < MIN_WORD_LENGTH:
        return True
    return False


def get_words(sentences):
    words = []
    for sentence in sentences:
        for word in sentence:
            if not is_stop_word(word):
                words.append(word.lower())
    return words


def read_file(file_name, encoding='utf-8'):
    file = open(file_name, 'r', encoding=encoding)
    file_data = file.readlines()
    article = '. '.join(file_data).split('. ')
    sentences = []

    for sentence in article:
        s = re.sub(r'[^a-zA-Z]', ' ', sentence).split(' ')
        sentences.append(list(filter(lambda x: x != '', s)))

    file.close()
    return sentences
