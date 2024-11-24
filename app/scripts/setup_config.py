# scripts/setup_config.py
import os
import shutil

def setup_configs():
    environments = ['development', 'production', 'test']
    
    for env in environments:
        src = f"config/config.{env}.example.json"
        dst = f"config/config.{env}.json"
        
        if not os.path.exists(dst):
            shutil.copyfile(src, dst)
            print(f"Created {dst}")

if __name__ == "__main__":
    setup_configs()