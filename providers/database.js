import storage from './storage.js';

let Storage = null;
let database = null;

// add all the methods you want for your database here
export default {
	async init() {
		Storage = await storage();
		database = await Storage.get('database.json').then((res) => JSON.parse(res.content));
	},

	async save() {
		await Storage.put('database.json', JSON.stringify(database));
	},

	async addUserAddress(userId, address) {
		if (!database.earlyBirds) {
			database.earlyBirds = {};
		}

		database.earlyBirds[userId] = address;

		await this.save();
	},

	getUserAddress(userId) {
		return database.earlyBirds?.[userId];
	},
};
