class Database {
    constructor() {
        this.dbName = 'CVBuilderDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error("خطأ في فتح قاعدة البيانات:", event.target.error);
                reject("فشل في فتح قاعدة البيانات");
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("تم فتح قاعدة البيانات بنجاح");
                resolve();
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                const objectStore = this.db.createObjectStore("cvs", { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("name", "name", { unique: false });
                console.log("تم إنشاء مخزن البيانات");
            };
        });
    }

    async saveCV(cvData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["cvs"], "readwrite");
            const objectStore = transaction.objectStore("cvs");
            const request = objectStore.add(cvData);

            request.onerror = (event) => {
                console.error("خطأ في حفظ السيرة الذاتية:", event.target.error);
                reject("فشل في حفظ السيرة الذاتية");
            };

            request.onsuccess = (event) => {
                console.log("تم حفظ السيرة الذاتية بنجاح");
                resolve(event.target.result);
            };
        });
    }

    async getCV(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["cvs"], "readonly");
            const objectStore = transaction.objectStore("cvs");
            const request = objectStore.get(id);

            request.onerror = (event) => {
                console.error("خطأ في استرجاع السيرة الذاتية:", event.target.error);
                reject("فشل في استرجاع السيرة الذاتية");
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
}

const database = new Database();