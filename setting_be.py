import pickle
import tensorflow as tf

num_labels = 10
sqlconn = r"chatbot.db"
min_words = 1
max_words = 10
st_max_seqlen = 7      # Max lengh of input CauHoi when create data set
st_batch_size = 10     # Training size of dataset
st_epochs = 15

# Load terms
load_terms = pickle.load(open('LearnML/terms.pkl', 'rb'))
# Load model 
load_model = tf.keras.models.load_model('LearnML/model.keras')

def load_terms_model():
    load_terms = pickle.load(open('LearnML/terms.pkl', 'rb'))
    load_model = tf.keras.models.load_model('LearnML/model.keras')