#!/bin/bash
set -e

# python3 naverKeyword.py &
# python3 naverDictionary.py &
# python3 naverArticleRank.py
python3 naverArticleCrawl.py


# Keep container running
exec "$@"