Install packages in requirements.txt: pip install -r requirements.txt

# Start API server
- Run server in bash cmd: uvicorn main:app --reload --port 5000

Add /docs#/ after url for Swagger UI API

# Push project to github
- git init
- git add .
- git commit -m ""
- git branch -M master
- git remote add origin "link"
- git push -u origin master

# Run BE in Debian
# 1 - Run SQLite server
- sqlite3 chatbot.db

# 2 - Run PY-BE in Debian
- Enter venv: source pyenv/bin/activate
- python -m uvicorn main:app --reload --port 5000
- Retrain model bcs Text Vectorization layer not have weights
- curl -X 'GET' \
  'http://127.0.0.1:5000/start' \
  -H 'accept: application/json'

  curl -X 'GET' \
  'http://127.0.0.1:5000/' \
  -H 'accept: application/json'

# 3 - Run Node.js server
- Remove modules from window env: rm -rf node_modules/
- Install Node modules of linux: npm update
- Install Better SQLite3: npm install better sqlite3
