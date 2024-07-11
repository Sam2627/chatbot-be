import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Import library
import pandas as pd
import tensorflow as tf
import pickle
import sqlite3

from ast import literal_eval
from sklearn.model_selection import train_test_split
from tensorflow import keras

# Get other lib
# from main import load_terms_model
import setting_be
from setting_be import sqlconn, st_max_seqlen, st_batch_size, st_epochs
from clean_text import clean_text

# Dataset parameter
max_seqlen = st_max_seqlen
batch_size = st_batch_size
padding_token = "<pad>"
auto = tf.data.AUTOTUNE

def train_ml():
    # data = pd.read_csv("C:/Users/PC/OneDrive/ThucTap/thuctap_4.4.csv", usecols = ['CauHoi', 'MaCauHoi'])
    # data = data.dropna(subset=['CauHoi', 'MaCauHoi'])
    # data = data[~data['CauHoi'].duplicated()]

    # Establish SQL connection
    conn = sqlite3.connect(sqlconn)
    c = conn.cursor()
    # Get data in database for dataframe
    c.execute("""SELECT CauHoi, MaCauHoi FROM CauHoiML WHERE MaCauHoi IS NOT NULL""")
    # Put retrieve data into dataframe
    data = pd.DataFrame(c.fetchall(), columns=["CauHoi", "MaCauHoi"])
    # Terminate database connection
    conn.close()

    # Clean data for training
    data['CauHoi'] = data['CauHoi'].apply(clean_text)

    # Filtering the rare terms.
    data_filtered = data.groupby('MaCauHoi').filter(lambda x: len(x) > 0)
    # Turn label into list string
    data_filtered['MaCauHoi'] = data_filtered['MaCauHoi'].apply(lambda x: literal_eval(x))

    test_split = 0.01
    # Initial train and test split.
    train_df, val_df = train_test_split(
        data_filtered,
        test_size=test_split,
    )

    # Preprocess labels using the StringLookup layer
    terms = tf.ragged.constant(train_df['MaCauHoi'].values)
    lookup = tf.keras.layers.StringLookup(output_mode="multi_hot")
    lookup.adapt(terms)
    
    max_seqlen = 6
    batch_size = 10
    padding_token = "<pad>"
    auto = tf.data.AUTOTUNE

    def make_dataset(dataframe, is_train=True):
        labels = tf.ragged.constant(dataframe['MaCauHoi'].values)
        label_binarized = lookup(labels).numpy()
        dataset = tf.data.Dataset.from_tensor_slices(
        (   dataframe['CauHoi'].values, label_binarized)
        )
        dataset = dataset.shuffle(batch_size * 5) if is_train else dataset
        return dataset.batch(batch_size)
    
    train_dataset = make_dataset(data_filtered, is_train=True)
    validation_dataset = make_dataset(val_df, is_train=False)

    vocabulary = set()
    train_df['CauHoi'].str.lower().str.split().apply(vocabulary.update)
    vocabulary_size = len(vocabulary)

    # Set layers and train models 
    text_vectorizer = keras.layers.TextVectorization(max_tokens=vocabulary_size, ngrams=1, output_mode="tf_idf")

    with tf.device("/CPU:0"):
        text_vectorizer.adapt(train_dataset.map(lambda text, label: text))

    train_dataset = train_dataset.map(
        lambda text, label: (text_vectorizer(text), label), num_parallel_calls=auto).prefetch(auto)
    validation_dataset = validation_dataset.map(
        lambda text, label: (text_vectorizer(text), label), num_parallel_calls=auto).prefetch(auto)
    
    def make_model():
        shallow_mlp_model = keras.Sequential(
            [
                keras.layers.Dense(512, activation="relu"),
                keras.layers.Dropout(0.4),
                keras.layers.Dense(512, activation="relu"),
                keras.layers.Dropout(0.4),
                keras.layers.Dense(lookup.vocabulary_size(), activation="sigmoid"),
            ]
        )
        return shallow_mlp_model
    
    shallow_mlp_model = make_model()
    shallow_mlp_model.compile(loss="binary_crossentropy", optimizer="adam", metrics=["binary_accuracy"])

    # Training model
    epochs = st_epochs
    shallow_mlp_model.fit(train_dataset, validation_data=validation_dataset, epochs=epochs)
    # Add layer for accept raw string and create model for inference
    model_for_inference = tf.keras.Sequential([text_vectorizer, shallow_mlp_model])

    # Export terms
    pickle.dump(terms, open('LearnML/terms.pkl','wb'))
    # Export model
    model_for_inference.save('LearnML/model.keras', save_format="keras")   

    # setting_be.load_terms_model()