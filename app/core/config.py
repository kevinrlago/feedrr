import logging
import os
import json
from pathlib import Path
from typing import Dict, Any

class Config:
    LOGIN_ENABLED = os.getenv("LOGIN_ENABLED", "false").lower() == "true"
    LOGIN_METHOD = os.getenv("LOGIN_METHOD", "basic")  # "basic" or "oidc"

CONFIG = Config()

# Configurar ruta base del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar configuraciones
CONFIG_PATH = BASE_DIR / 'config' / 'config.json'
FEEDS_PATH = BASE_DIR / 'config' / 'feeds.json'

# Cargar configuraciones JSON
with open(CONFIG_PATH, 'r') as f:
    CONFIG: Dict[str, Any] = json.load(f)

# Asegurarse de que la configuración de Telegram tenga todas las claves necesarias
if 'telegram' not in CONFIG:
    CONFIG['telegram'] = {}

if 'bot_token' not in CONFIG['telegram']:
    CONFIG['telegram']['bot_token'] = ''

if 'chat_id' not in CONFIG['telegram']:
    CONFIG['telegram']['chat_id'] = ''

if 'chats' not in CONFIG['telegram']:
    CONFIG['telegram']['chats'] = []

with open(FEEDS_PATH, 'r') as f:
    FEEDS_CONFIG = json.load(f)

def load_config():
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_PATH, 'w') as f:
        json.dump(config, f, indent=4)

def setup_logging():
    log_dir = BASE_DIR / 'logs'
    os.makedirs(log_dir, exist_ok=True)
    logging.basicConfig(
        level=logging.getLevelName(CONFIG.get('logging', {}).get('level', 'INFO')),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(log_dir / CONFIG.get('logging', {}).get('file', 'app.log'))
        ]
    )
    return logging.getLogger(__name__)

logger = setup_logging()

# app/core/config.py
APP_NAME = "Feedrr"
DATABASE_NAME = "feedrr"

import os
import json
from typing import Dict, Any

def load_config() -> Dict[str, Any]:
    env = os.getenv("APP_ENV", "development")
    config_path = f"config/config.{env}.json"
    
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration file not found at {config_path}")
        
    with open(config_path, "r") as f:
        return json.load(f)

CONFIG = load_config()