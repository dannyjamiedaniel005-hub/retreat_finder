from pymongo import MongoClient


# MongoDB connection

client = MongoClient(
    "mongodb://localhost:27017/"
)


# Database

db = client["retreat_db"]


# Collections

users = db["users"]

retreats = db["retreats"]