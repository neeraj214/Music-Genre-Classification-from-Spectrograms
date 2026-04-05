from src.model import MusicCNNRNN
import yaml
cfg = yaml.safe_load(open('configs/config.yaml'))
m = MusicCNNRNN(cfg)
total = sum(p.numel() for p in m.parameters())
print(f'Model params: {total:,}')
print('Model OK')
