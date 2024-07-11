import re

from functions.remove_useless_phrase import remove_useless_phrase
from functions.acronym_word import acronym_word
from functions.standardized_word import standardized_word
from functions.question_standardized import question_standardized
from functions.merge_word import merge_word

def clean_text(text):
    text = text.lower()
    # Remove other charater in word
    text = special_character_remover.sub('', text)
    text = text.replace(' - ', ' ')
    text = text.replace('  ', ' ')
    # Remove useless phrase
    text = remove_useless_phrase(text)
    # Acronym
    text = acronym_word(text)
    # Standardized pharse
    text = standardized_word(text)
    # Standardized question
    text = question_standardized(text)
    # Merge words to phrase
    text = merge_word(text)
    # Remove words without value
    text = ' '.join(word for word in text.split() if word in value_words)
    # Convert accent word to vni type
    text = replace_accents(text)
    # Remove other characters
    #text = extra_symbol_remover.sub('', text)

    return text

# Define value words
def value_words_list(file_path):
    with open(file_path, 'r', encoding="utf-8") as f:
        value_words = f.readlines()
        stop_set = set(m.strip() for m in value_words)
        return list(frozenset(stop_set))

# Set up function
value_words_path = "vietnamese_val_3.txt"
value_words = value_words_list(value_words_path)

# Clean text from special chars
special_character_remover = re.compile('[/(){}\[\]\|@.,;:?!]')
extra_symbol_remover = re.compile('[^0-9a-z #+_]')

# Convert word accents to vni-key corresponding
s0 = u'á|à|ả|ã|ạ|â|ă|đ|é|è|ẻ|ẽ|ẹ|ê|í|ì|ỉ|ĩ|ị|ó|ò|ỏ|õ|ọ|ô|ơ|ú|ù|ủ|ũ|ụ|ư|ý|ỳ|ỷ|ỹ|ỵ'
s1 = u'a1a2a3a4a5a6a8d9e1e2e3e4e5e6i1i2i3i4i5o1o2o3o4o5o6o7u1u2u3u4u5u7y1y2y3y4y5'
s2 = u'ấ||ầ||ẩ||ẫ||ậ||ắ||ằ||ẳ||ẵ||ặ||ế||ề||ể||ễ||ệ||ố||ồ||ổ||ỗ||ộ||ớ||ờ||ở||ỡ||ợ||ứ||ừ||ử||ữ||ự'
s3 = u'a16a26a36a46a56a18a28a38a48a58e16e26e36e46e56o16o26o36o45o56o17o27o37o47o57u17u27u37u47u57'

def replace_accents(input_str):
    s = ''
    for c in input_str:
        if c in s0:
            s += s1[s0.index(c)] + s1[(s0.index(c) + 1)]
        elif c in s2:
            s += s3[s2.index(c)] + s3[(s2.index(c) + 1)] + s3[(s2.index(c) + 2)]
        else:
            s += c
    return s