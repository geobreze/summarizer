import os

import common
import text_rank_sum
import tf_idf


def process_file(filepath, keywords_n=3, sentences_n=2, training=False, encoding='utf-8'):
    print("Processing file " + filepath)
    file = open(filepath, encoding=encoding)
    source = "".join(file.readlines())
    file.close()
    sentences = common.read_file(filepath, encoding=encoding)
    words = common.get_words(sentences)
    if not training:
        print("Generating summary")
        generated_summary = text_rank_sum.generate_summary(sentences, top_n_words=keywords_n,
                                                           top_n_sentences=sentences_n)
    print("Finding keywords")
    tfidf_keywords = tf_idf.find_tfidf_keywords(sentences, top_n=keywords_n)
    if not training:
        obj = {
            'source': source,
            'words': words,
            'keywords_heuristic': generated_summary['keywords'],
            'keywords_tfidf': tfidf_keywords,
            'summary': generated_summary['summary'],
            'train': False
        }
    else:
        obj = {
            'words': words,
            'source': source,
            'train': True,
            'keywords_tfidf': tfidf_keywords
        }
    common.save_to_db(obj)
    return obj


def train():
    for file in os.listdir("txts"):
        f = os.path.join("txts", file)
        process_file(f, training=True, encoding='latin-1')


if __name__ == "__main__":
    train()
