import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Import library
import pandas as pd
import tensorflow as tf
import pickle
from tensorflow import keras

# Process label in list str library
from ast import literal_eval

# from main import load_terms, load_model
from setting_be import num_labels, st_max_seqlen, st_batch_size
# from setting_be import load_terms, load_model

# terms = pickle.load(open('LearnML/terms.pkl', 'rb'))
# model_for_inference = keras.models.load_model('LearnML/model.keras')

# Dataset parameter
max_seqlen = st_max_seqlen
batch_size = st_batch_size
padding_token = "<pad>"
auto = tf.data.AUTOTUNE

# def make_dataset(dataframe, is_train=True):
#     labels = tf.ragged.constant(dataframe["MaCauHoi"].values)
#     label_binarized = lookup(labels).numpy()
#     dataset = tf.data.Dataset.from_tensor_slices(
#         (dataframe["CauHoi"].values, label_binarized)
#     )
#     dataset = dataset.shuffle(batch_size * 5) if is_train else dataset
#     return dataset.batch(batch_size)

# Using predict model return list str labels
def predict_input(input_text) -> list[str]:
    # Clean input text and accents - processed in api method
    #input_text = clean_text(input_text)

    # Load terms
    lookup = tf.keras.layers.StringLookup(output_mode="multi_hot")
    terms = pickle.load(open('LearnML/terms.pkl', 'rb'))
    # terms = setting_be.load_terms
    lookup.adapt(terms)

    # Load models
    model_for_inference = tf.keras.models.load_model('LearnML/model.keras')
    # model_for_inference = setting_be.load_model

    def make_dataset(dataframe, is_train=True):
        labels = tf.ragged.constant(dataframe["MaCauHoi"].values)
        label_binarized = lookup(labels).numpy()
        dataset = tf.data.Dataset.from_tensor_slices(
            (dataframe["CauHoi"].values, label_binarized)
        )
        dataset = dataset.shuffle(batch_size * 5) if is_train else dataset
        return dataset.batch(batch_size)

    # Create data frame with input text
    pre_data = { "CauHoi": [input_text],
                 "MaCauHoi": ["['UNK']"]
    }

    # Create data frame
    pre_df = pd.DataFrame(data=pre_data)

    # Convert data frame labels into list str
    input_data_filtered = pre_df
    input_data_filtered["MaCauHoi"] = input_data_filtered["MaCauHoi"].apply(lambda x: literal_eval(x))

    # Make input data set for model
    inference_dataset = make_dataset(input_data_filtered, is_train=False)
    text_batch, label_batch = next(iter(inference_dataset))

    # Start perdict
    predicted_probabilities = model_for_inference.predict(text_batch)

    # Return predict list
    top_labels = [
    x
        for _, x in sorted(
            zip(predicted_probabilities[0], lookup.get_vocabulary()),
            key=lambda pair: pair[0],
            reverse=True,
        )
    ][:num_labels]

    list_labels: list[str] = []

    for label in top_labels:
        list_labels.append(str(label))

    #txt_str = (','.join([label for label in top_labels]))

    return list_labels

def load_terms_model():
    load_terms = pickle.load(open('LearnML/terms.pkl', 'rb'))
    load_model = tf.keras.models.load_model('LearnML/model.keras')