class LivePreview {
    constructor(previewElement) {
        this.previewElement = previewElement;
    }

    update(cvData) {
        this.previewElement.innerHTML = `
            <h2>${cvData.name}</h2>
            <p>البريد الإلكتروني: ${cvData.email}</p>
            <p>الهاتف: ${cvData.phone}</p>
            <h3>الخبرات</h3>
            <ul>
                ${cvData.experiences.map(exp => `<li>${exp.title} في ${exp.company}</li>`).join('')}
            </ul>
            <h3>التعليم</h3>
            <ul>
                ${cvData.education.map(edu => `<li>${edu.degree} من ${edu.institution}</li>`).join('')}
            </ul>
        `;
    }
}