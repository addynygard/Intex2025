from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import List, Dict

import uvicorn
import asyncio
app = FastAPI()
# Sample data for demonstration
items = {"item1": "This is item 1", "item2": "This is item 2"}
@app.get("/")
async def root():
    await asyncio.sleep(1)  # Simulate a long-running operation
    return {"message": "Hello World"}
@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

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

def execute_query(query: str, params: tuple = ()):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    conn.close()

# 🎯 Search endpoint
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

# 🔁 Recommendation routes
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

# 🎯 New endpoint to submit movie ratings
class Rating(BaseModel):
    user_id: int
    show_id: str
    rating: int

@app.post("/api/movie/rate-movie")
def rate_movie(rating: Rating):
    # Ensure the rating is valid
    if rating.rating < 1 or rating.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")

    query = """
        INSERT INTO user_ratings (user_id, show_id, rating)
        VALUES (?, ?, ?)
    """
    execute_query(query, (rating.user_id, rating.show_id, rating.rating))
    return {"message": "Rating submitted successfully"}
