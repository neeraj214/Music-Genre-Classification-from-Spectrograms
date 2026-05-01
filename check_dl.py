from src.dataset import build_dataloaders
import yaml

def main():
    cfg = yaml.safe_load(open('configs/config.yaml'))
    train_dl, val_dl, test_dl = build_dataloaders(cfg)
    batch = next(iter(train_dl))
    print('Batch shape:', batch[0].shape)
    print('Labels shape:', batch[1].shape)
    print('DataLoader OK')

if __name__ == '__main__':
    main()

