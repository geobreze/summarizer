import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
from nltk.cluster.util import cosine_distance
from common import lemmatizer, is_stop_word


def sentence_similarity(first, second):
    first = [lemmatizer.lemmatize(w.lower()) for w in first]
    second = [lemmatizer.lemmatize(w.lower()) for w in second]
    all_words = list(set(first + second))

    first_vector = [0] * len(all_words)
    second_vector = [0] * len(all_words)

    for w in first:
        if not is_stop_word(w):
            first_vector[all_words.index(w)] += 1

    for w in second:
        if not is_stop_word(w):
            second_vector[all_words.index(w)] += 1

    distance = cosine_distance(first_vector, second_vector)
    return 0 if np.isnan(distance) else 1 - distance


def build_similarity_matrix(sentences):
    similarity_matrix = np.zeros((len(sentences), len(sentences)))

    for idx1 in range(len(sentences)):
        for idx2 in range(len(sentences)):
            if idx1 != idx2:
                similarity_matrix[idx1][idx2] = sentence_similarity(sentences[idx1], sentences[idx2])

    return similarity_matrix


def find_key_words(sentences, top_n=5):
    stemmed_words_dict = dict()
    stemmed_words_freq = dict()
    for sentence in sentences:
        for word in sentence:
            if not is_stop_word(word.lower()):
                w = lemmatizer.lemmatize(word.lower())
                stemmed_words_dict[word] = w
                if w not in stemmed_words_freq:
                    stemmed_words_freq[w] = 0
                else:
                    stemmed_words_freq[w] += 1
    reversed_words_dict = dict()
    for key, value in stemmed_words_dict.items():
        reversed_words_dict[value] = key
    sorted_freq = sorted([(s, w) for w, s in stemmed_words_freq.items()], reverse=True)
    keywords = []
    for i in range(min(top_n, len(sorted_freq))):
        keywords.append(reversed_words_dict[sorted_freq[i][1]])
    return keywords


def generate_summary(sentences, top_n_sentences=5, top_n_words=5):
    summarize_text = []
    keywords = find_key_words(sentences, top_n=top_n_words)
    sentence_similarity_matrix = build_similarity_matrix(sentences)
    sentence_similarity_graph = nx.from_numpy_array(sentence_similarity_matrix)
    scores = nx.pagerank(sentence_similarity_graph)

    ranked_sentence = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)

    for i in range(min(top_n_sentences, len(ranked_sentence))):
        summarize_text.append(" ".join(ranked_sentence[i][1]))

    return {"summary": ". ".join(summarize_text) + ".", "graph": sentence_similarity_graph, "keywords": keywords}


def draw_summary_graph(graph, output_file):
    pos = nx.shell_layout(graph, scale=3)
    nx.draw_networkx_nodes(graph, pos)
    nx.draw_networkx_edges(graph, pos)
    labels = dict([((u, v), np.round(d['weight'], 2)) for u, v, d in graph.edges(data=True)])
    nx.draw_networkx_edge_labels(graph, pos, edge_labels=labels, label_pos=0.5)
    plt.savefig(output_file)
