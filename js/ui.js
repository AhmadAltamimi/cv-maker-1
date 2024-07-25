class UI {
    constructor() {
        this.templateContainer = document.querySelector('.template-container');
        this.createCVButton = document.getElementById('create-cv');
    }

    init() {
        this.createCVButton.addEventListener('click', this.showTemplateSelection.bind(this));
        this.templateContainer.addEventListener('click', this.selectTemplate.bind(this));
    }

    showTemplateSelection() {
        document.getElementById('home').style.display = 'none';
        document.getElementById('templates').style.display = 'block';
    }

    selectTemplate(event) {
        const template = event.target.closest('.template');
        if (template) {
            const templateId = template.dataset.template;
            this.loadCVForm(templateId);
        }
    }

    loadCVForm(templateId) {
        // هنا سنقوم بتحميل نموذج إدخال بيانات السيرة الذاتية
        console.log(`تم اختيار النموذج رقم ${templateId}`);
        // يمكنك إضافة المزيد من المنطق هنا لتحميل النموذج المناسب
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

const ui = new UI();