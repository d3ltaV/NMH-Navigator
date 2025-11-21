CREATE TABLE user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_pic TEXT NOT NULL
);

create TABLE review (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL, 
  target_name TEXT NOT NULL,     
  review TEXT,
  rating INTEGER,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);