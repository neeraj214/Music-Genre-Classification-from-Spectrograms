import os, json
for f in ['data/train_split.json','data/val_split.json','data/test_split.json']:
    try:
        data = json.load(open(f))
        print(f"{f}: {len(data['files'])} samples")
    except Exception as e:
        print(f"Error reading {f}: {e}")
