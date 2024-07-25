document.addEventListener('DOMContentLoaded', function() {
    const templateContainer = document.querySelector('.template-container');
    const cvForm = document.getElementById('cv-form');
    const cvPreview = document.getElementById('cv-preview');
    const previewContent = document.getElementById('preview-content');
    const generatePdfBtn = document.getElementById('generate-pdf');
    const languageSelect = document.getElementById('language-select');
    const startBtn = document.getElementById('start-btn');
    const primaryColorPicker = document.getElementById('primary-color');
    const fontFamilySelector = document.getElementById('font-family');
    const saveDraftBtn = document.getElementById('save-draft');
    const loadDraftBtn = document.getElementById('load-draft');
    const profilePictureInput = document.getElementById('profile-picture');
    const addLanguageBtn = document.getElementById('add-language');

    // Initialize i18next
    i18next.init({
        lng: 'ar', // default language
        resources: translations
    }, function(err, t) {
        updateContent(i18next.language);
    });

    // Language change
    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        i18next.changeLanguage(selectedLanguage, (err, t) => {
            if (err) return console.log('something went wrong loading', err);
            updateContent(selectedLanguage);
        });
    });

    // Update content based on selected language
    function updateContent(language) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = i18next.t(key);
        });
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }

    // Start button
    startBtn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#templates').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Template selection
    templateContainer.addEventListener('click', function(e) {
        if (e.target.closest('.template')) {
            const selectedTemplate = e.target.closest('.template');
            const templateId = selectedTemplate.dataset.template;
            loadTemplate(templateId);
        }
    });

      // Load selected template
      function loadTemplate(templateId) {
        fetch(`templates/template${templateId}.html`)
            .then(response => response.text())
            .then(html => {
                cvForm.style.display = 'block';
                previewContent.innerHTML = html;
                document.querySelector('#cv-form').scrollIntoView({
                    behavior: 'smooth'
                });
                document.getElementById('template-customization').style.display = 'block';
            })
            .catch(error => console.error('Error loading template:', error));
    }

    // Add experience fields
    document.getElementById('add-experience').addEventListener('click', addExperienceField);

    // Add education fields
    document.getElementById('add-education').addEventListener('click', addEducationField);

    // Form submission
    document.getElementById('cv-data-form').addEventListener('submit', handleFormSubmit);

    // Generate PDF
    generatePdfBtn.addEventListener('click', generatePDF);

    function updatePreviewStyle() {
        const primaryColor = primaryColorPicker.value;
        const fontFamily = fontFamilySelector.value;
        previewContent.style.setProperty('--primary-color', primaryColor);
        previewContent.style.fontFamily = fontFamily;
    }

    function saveDraft() {
        const formData = new FormData(document.getElementById('cv-data-form'));
        const draftData = Object.fromEntries(formData.entries());
        localStorage.setItem('cvDraft', JSON.stringify(draftData));
        alert(i18next.t('draft-saved'));
    }

    function loadDraft() {
        const draftData = JSON.parse(localStorage.getItem('cvDraft'));
        if (draftData) {
            Object.keys(draftData).forEach(key => {
                const field = document.getElementsByName(key)[0];
                if (field) {
                    field.value = draftData[key];
                }
            });
            alert(i18next.t('draft-loaded'));
            updatePreview();
        } else {
            alert(i18next.t('no-draft'));
        }
    }

    function handleProfilePicture(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                profilePictureInput.parentNode.insertBefore(img, profilePictureInput.nextSibling);
            }
            reader.readAsDataURL(file);
        }
    }

    function addLanguageField() {
        const languagesFields = document.getElementById('languages-fields');
        const newField = document.createElement('div');
        newField.className = 'language-item';
        newField.innerHTML = `
            <input type="text" name="language[]" placeholder="${i18next.t('language')}" required>
            <select name="proficiency[]">
                <option value="beginner">${i18next.t('beginner')}</option>
                <option value="intermediate">${i18next.t('intermediate')}</option>
                <option value="advanced">${i18next.t('advanced')}</option>
                <option value="fluent">${i18next.t('fluent')}</option>
            </select>
            <button type="button" class="remove-btn">${i18next.t('remove')}</button>
        `;
        languagesFields.appendChild(newField);
        
        newField.querySelector('.remove-btn').addEventListener('click', function() {
            languagesFields.removeChild(newField);
        });
    }

    function addExperienceField() {
        const experienceFields = document.getElementById('experience-fields');
        const newField = document.createElement('div');
        newField.className = 'experience-item';
        newField.innerHTML = `
            <input type="text" name="jobTitle[]" placeholder="${i18next.t('job-title')}" required>
            <input type="text" name="company[]" placeholder="${i18next.t('company')}" required>
            <input type="date" name="startDate[]" required>
            <input type="date" name="endDate[]">
            <textarea name="jobDescription[]" placeholder="${i18next.t('job-description')}" required></textarea>
            <button type="button" class="remove-btn">${i18next.t('remove')}</button>
        `;
        experienceFields.appendChild(newField);
        
        newField.querySelector('.remove-btn').addEventListener('click', function() {
            experienceFields.removeChild(newField);
        });
    }

    function addEducationField() {
        const educationFields = document.getElementById('education-fields');
        const newField = document.createElement('div');
        newField.className = 'education-item';
        newField.innerHTML = `
            <input type="text" name="degree[]" placeholder="${i18next.t('degree')}" required>
            <input type="text" name="institution[]" placeholder="${i18next.t('institution')}" required>
            <input type="date" name="graduationDate[]" required>
            <button type="button" class="remove-btn">${i18next.t('remove')}</button>
        `;
        educationFields.appendChild(newField);
        
        newField.querySelector('.remove-btn').addEventListener('click', function() {
            educationFields.removeChild(newField);
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        updatePreview(formData);
        cvPreview.style.display = 'block';
        document.querySelector('#cv-preview').scrollIntoView({
            behavior: 'smooth'
        });
    }

    function updatePreview(formData) {
        // This function needs to be implemented based on the selected template
        // For now, we'll just display the form data in a simple format
        let previewHTML = `
            <h2>${formData.get('firstName')} ${formData.get('lastName')}</h2>
            <p>Email: ${formData.get('email')}</p>
            <p>Phone: ${formData.get('phone')}</p>
            <p>Address: ${formData.get('address')}</p>
            
            <h3>${i18next.t('work-experience')}</h3>
        `;

        // Add work experience
        const jobTitles = formData.getAll('jobTitle[]');
        const companies = formData.getAll('company[]');
        const startDates = formData.getAll('startDate[]');
        const endDates = formData.getAll('endDate[]');
        const jobDescriptions = formData.getAll('jobDescription[]');

        for (let i = 0; i < jobTitles.length; i++) {
            previewHTML += `
                <div>
                    <h4>${jobTitles[i]} at ${companies[i]}</h4>
                    <p>${startDates[i]} - ${endDates[i] || 'Present'}</p>
                    <p>${jobDescriptions[i]}</p>
                </div>
            `;
        }

        previewHTML += `<h3>${i18next.t('education')}</h3>`;

        // Add education
        const degrees = formData.getAll('degree[]');
        const institutions = formData.getAll('institution[]');
        const graduationDates = formData.getAll('graduationDate[]');

        for (let i = 0; i < degrees.length; i++) {
            previewHTML += `
                <div>
                    <h4>${degrees[i]}</h4>
                    <p>${institutions[i]}</p>
                    <p>${i18next.t('graduation-date')}: ${graduationDates[i]}</p>
                </div>
            `;
        }

        previewHTML += `<h3>${i18next.t('skills')}</h3>`;
        previewHTML += `<p>${formData.get('skills')}</p>`;

        previewHTML += `<h3>${i18next.t('languages')}</h3>`;

        // Add languages
        const languages = formData.getAll('language[]');
        const proficiencies = formData.getAll('proficiency[]');

        for (let i = 0; i < languages.length; i++) {
            previewHTML += `
                <p>${languages[i]}: ${i18next.t(proficiencies[i])}</p>
            `;
        }

        previewContent.innerHTML = previewHTML;
        updatePreviewStyle();
    }

    function generatePDF() {
        // This function needs to be implemented
        // You might want to use a library like html2pdf.js or jsPDF
        console.log('Generating PDF...');
        alert('PDF generation feature coming soon!');
        
        // Increment download count
        const downloadCount = document.getElementById('download-count');
        downloadCount.textContent = parseInt(downloadCount.textContent) + 1;
    }

    // Add event listeners
    primaryColorPicker.addEventListener('change', updatePreviewStyle);
    fontFamilySelector.addEventListener('change', updatePreviewStyle);
    saveDraftBtn.addEventListener('click', saveDraft);
    loadDraftBtn.addEventListener('click', loadDraft);
    profilePictureInput.addEventListener('change', handleProfilePicture);
    addLanguageBtn.addEventListener('click', addLanguageField);

    // Modify the existing form fields to trigger updatePreview on input
    document.querySelectorAll('#cv-data-form input, #cv-data-form textarea').forEach(input => {
        input.addEventListener('input', () => {
            const formData = new FormData(document.getElementById('cv-data-form'));
            updatePreview(formData);
        });
    });

    // Initial preview update
    updatePreview(new FormData(document.getElementById('cv-data-form')));

    // Increment view count when CV is previewed
    const viewCount = document.getElementById('view-count');
    viewCount.textContent = parseInt(viewCount.textContent) + 1;
});