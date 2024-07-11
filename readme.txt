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

# Get new update of project
- git fetch "link"

# Run PY-BE in Debian
- Enter venv: source pyenv/bin/activate
- python -m uvicorn main:app --reload --port 5000
- curl -X 'GET' \
  'http://127.0.0.1:5000/start' \
  -H 'accept: application/json'

# Run SQLite server
- sqlite3 chatbot.db

# Run Node.js server
- Remove modules from window env: rm -rf node_modules/
- Install Node modules of linux: npm update
- Install Better SQLite3: npm install better sqlite3
