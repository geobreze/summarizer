from gensim import corpora
from gensim import models

import common

DATA_DIR = "data/"


def load_corpus(dictionary):
    docs = [[common.lemmatizer.lemmatize(word) for word in doc] for doc in common.load_all_docs()]
    dictionary.add_documents(docs)
    return [dictionary.doc2bow(doc) for doc in docs]


def find_tfidf_keywords(sentences, top_n=3):
    dictionary = corpora.Dictionary()
    words = [common.lemmatizer.lemmatize(word) for word in common.get_words(sentences)]
    dictionary.add_documents([words])
    corpus = load_corpus(dictionary)
    doc_corpus = dictionary.doc2bow(words)
    corpus.append(doc_corpus)

    model = models.TfidfModel(corpus, smartirs='ntc')
    ranked = sorted([(weight, word_id) for (word_id, weight) in model[doc_corpus]], reverse=True)
    print(model)
    keywords = []
    print(ranked)
    for i in range(min(top_n, len(ranked))):
        keywords.append(dictionary[ranked[i][1]])

    return keywords

print(common.lemmatizer.lemmatize('numerals'))