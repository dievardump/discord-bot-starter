import { StorageManager } from '@slynova/flydrive';
import path from 'path';

const sotrageConfig = {
	default: 'local',
	disks: {
		local: {
			driver: 'local',
			config: {
				root: path.join(path.resolve(path.dirname('')), 'storage'),
			},
		},
	},
};

export default async () => {
	const storage = new StorageManager(sotrageConfig);
	return storage.disk('local');
};
