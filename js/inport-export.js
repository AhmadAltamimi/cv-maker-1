class ImportExport {
    static exportCV(cvData) {
        const jsonString = JSON.stringify(cvData);
        const blob = new Blob([jsonString], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cv_data.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    static importCV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const cvData = JSON.parse(event.target.result);
                    resolve(cvData);
                } catch (error) {
                    reject("فشل في قراءة الملف: " + error.message);
                }
            };
            reader.onerror = (error) => reject("حدث خطأ أثناء قراءة الملف: " + error);
            reader.readAsText(file);
        });
    }
}