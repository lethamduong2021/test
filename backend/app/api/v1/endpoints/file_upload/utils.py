import os
import time

def get_folder_size(folder_path):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(folder_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size

def delete_oldest_file(folder_path):
    files = [os.path.join(folder_path, f) for f in os.listdir(folder_path)]
    files = [f for f in files if os.path.isfile(f)]
    if files:
        oldest_file = min(files, key=os.path.getctime)
        os.remove(oldest_file)

def delete_files_older_than(folder_path, days=7):
    now = time.time()
    cutoff = now - days * 86400
    for dirpath, dirnames, filenames in os.walk(folder_path):
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            if os.path.isfile(file_path):
                if os.path.getmtime(file_path) < cutoff:
                    os.remove(file_path)
