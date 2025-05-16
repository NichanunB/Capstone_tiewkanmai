#ก่อนใช้งาน กรุณาติดตั้งไลบรารีที่จำเป็น:
#pip install sqlalchemy pymysql scikit-learn pandas numpy

#🔧 ขั้นตอนการทำ API ด้วย FastAPI
#1. ติดตั้งแพ็กเกจ
#pip install fastapi uvicorn sqlalchemy pymysql scikit-learn scipy pandas

#2. main.py สำหรับ FastAPI
from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack
from collections import defaultdict

# ✅ สร้าง FastAPI instance
app = FastAPI()

# 🔌 เชื่อมต่อ MySQL
engine = create_engine("mysql+pymysql://<username>:<password>@<host>:3306/TiewKanMai")

class Recommendation(BaseModel):
    user_id: int
    top_n: int = 20

@app.post("/recommend/")
def recommend_places(req: Recommendation):
    # 📥 ดึงข้อมูล
    places = pd.read_sql("""
        SELECT p.place_id, p.place_name AS name, p.description,
               c.name AS category, p.sub_category
        FROM place p
        LEFT JOIN category c ON p.category = c.cate_id
    """, engine)

    user_fav = pd.read_sql("SELECT * FROM user_fav_place", engine)

    places['description'] = places['description'].fillna('')
    liked_ids = user_fav[user_fav['user_id'] == req.user_id]['place_id'].tolist()
    liked_indices = places[places['place_id'].isin(liked_ids)].index

    if not liked_indices.any():
        return {"message": "User has no liked places."}

    # TF-IDF
    name_tfidf = TfidfVectorizer().fit_transform(places['name'])
    desc_tfidf = TfidfVectorizer().fit_transform(places['description'])
    cat_tfidf = TfidfVectorizer().fit_transform(places['category'])

    combined_tfidf = hstack([
        name_tfidf.multiply(0.2),
        desc_tfidf.multiply(0.5),
        cat_tfidf.multiply(0.3)
    ])

    liked_vectors = combined_tfidf[liked_indices]
    user_profile = liked_vectors.mean(axis=0).A
    cos_sim = cosine_similarity(user_profile, combined_tfidf)[0]
    places['score'] = cos_sim

    recommend = places[~places['place_id'].isin(liked_ids)].copy()
    recommend = recommend.sort_values(by='score', ascending=False)

    # Category Penalty
    category_counts = defaultdict(int)
    adjusted_scores = []
    for _, row in recommend.iterrows():
        cat = row['category']
        score = row['score']
        if category_counts[cat] >= 20:
            score *= 0.1
        category_counts[cat] += 1
        adjusted_scores.append(score)

    recommend['adjusted_score'] = adjusted_scores
    recommend = recommend.sort_values(by='adjusted_score', ascending=False)

    # MMR Diversification
    liked_categories = places.loc[liked_indices, 'category'].unique()
    num_categories_liked = len(liked_categories)
    alpha = max(0.3, min(0.7, 0.7 - (0.4 * (num_categories_liked / 10))))

    num_recommend = req.top_n
    recommend_vectors = combined_tfidf[recommend.index]
    scores = recommend['adjusted_score'].values

    selected_indices = []
    candidate_indices = list(range(len(recommend)))

    while len(selected_indices) < num_recommend and candidate_indices:
        if not selected_indices:
            best_idx = candidate_indices[np.argmax(scores[candidate_indices])]
        else:
            sim_to_selected = cosine_similarity(
                recommend_vectors[candidate_indices],
                recommend_vectors[selected_indices]
            ).max(axis=1)
            mmr_values = alpha * scores[candidate_indices] - (1 - alpha) * sim_to_selected
            best_idx = candidate_indices[np.argmax(mmr_values)]

        selected_indices.append(best_idx)
        candidate_indices.remove(best_idx)

    final_recommend = recommend.iloc[selected_indices]
    return final_recommend[['place_id', 'name', 'category', 'adjusted_score']].to_dict(orient='records')

#3. รันเซิร์ฟเวอร์ FastAPI
#uvicorn main:app --reload
