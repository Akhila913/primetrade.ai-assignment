import logging
import sys
from pathlib import Path

LOG_FILE = Path("app.log")

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(LOG_FILE, mode="a", encoding="utf-8"),
        ],
    )