import pandas as pd
from collections import Counter

csv_filename = './outputs/documents.csv'
df = pd.read_csv(csv_filename)
words = df.loc[:, 'document']
words_list = []
for line in words:
    w = line.split()
    words_list += w

for i in range(10):
    print(words_list[i])

counter = Counter(words_list)
print(counter.most_common(100))