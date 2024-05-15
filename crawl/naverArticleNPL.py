import pandas as pd

csv_filename = "./100_264.csv"
df = pd.read_csv(csv_filename)
text = df.loc[:, 'article_title']
