from src.model import get_model
import yaml
cfg = yaml.safe_load(open('configs/config.yaml'))
m = get_model(cfg)
total = sum(p.numel() for p in m.parameters())
print(f'Model params: {total:,}')
print('Model OK')

