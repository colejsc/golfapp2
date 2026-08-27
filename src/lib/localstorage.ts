export class LocalStorage {
    storage!: Storage;

    constructor() {
         if (typeof window !== 'undefined') 
            this.storage = window.localStorage;
    }

    create(key: string, value: object): void {
        this.storage.setItem(key, JSON.stringify(value));
    }

    get(key: string): object | null {
        const item = this.storage && this.storage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    set(key: string, value: object): void {
        if (this.storage.getItem(key)) {
            this.storage.setItem(key, JSON.stringify(value));
        } else {
            this.create(key, value);
        }
    }

    delete(key: string): void {
        this.storage.removeItem(key);
    }
}

let localStore: LocalStorage;

export function GetLocalStorage(): LocalStorage {
    if (!localStore) {
        localStore = new LocalStorage();
    }
    return localStore;
}