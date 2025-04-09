from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from typing import List, Dict

app = FastAPI()

DB_PATH = "Movies.db"

# Enable CORS so your React frontend can make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared function to query the database
def query_table(query: str, params: tuple = ()):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return rows

# 🎯 New search endpoint
@app.get("/api/movie/search")
def search_movies(title: str = Query(...)) -> List[Dict]:
    query = """
        SELECT show_id, title FROM movies_titles
        WHERE title LIKE ?
        LIMIT 5
    """
    search_term = f"%{title}%"
    result = query_table(query, (search_term,))
    return [{"show_id": row[0], "title": row[1]} for row in result]

# 🔁 Existing recommendation routes
@app.get("/recommendations/similar/{title}")
def get_similar_movies(title: str):
    query = """
        SELECT movie_1, movie_2, movie_3, movie_4, movie_5,
               movie_6, movie_7, movie_8, movie_9, movie_10
        FROM similar_movies WHERE input_title = ?
    """
    result = query_table(query, (title,))
    return [{"title": title} for title in result[0] if title] if result else []

@app.get("/recommendations/top-rated")
def get_top_rated():
    query = "SELECT title FROM top_rated_movies"
    result = query_table(query)
    return [{"title": row[0]} for row in result]

@app.get("/recommendations/genre/{genre}")
def get_top_by_genre(genre: str):
    table_name = f"top_rated_by_genre_filtered_{genre.lower()}"
    query = f"SELECT title FROM {table_name}"
    result = query_table(query)
    return [{"title": row[0]} for row in result]

@app.get("/recommendations/user/{user_id}")
def get_user_recommendations(user_id: int):
    query = """
        SELECT recommended_1, recommended_2, recommended_3, recommended_4, recommended_5,
               recommended_6, recommended_7, recommended_8, recommended_9, recommended_10
        FROM user_recommendations WHERE user_id = ?
    """
    result = query_table(query, (user_id,))
    return [{"title": title} for title in result[0] if title] if result else []
