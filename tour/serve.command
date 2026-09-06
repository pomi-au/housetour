#!/bin/bash
# Starts a local web server for tour.html and opens it in the default browser.
# Browsers block WebGL texture uploads from file:// images, so the tour needs http://.
cd "$(dirname "$0")/.." || exit 1
PORT=8765
(sleep 1; open "http://localhost:$PORT/tour.html") &
python3 -m http.server "$PORT"
