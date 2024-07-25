class Validator {
    static validateName(name) {
        return name.length >= 2 && name.length <= 50;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^\+?[0-9]{10,14}$/;
        return phoneRegex.test(phone);
    }

    static validateForm(formData) {
        const errors = [];
        if (!this.validateName(formData.name)) {
            errors.push("الاسم يجب أن يكون بين 2 و 50 حرفًا");
        }
        if (!this.validateEmail(formData.email)) {
            errors.push("البريد الإلكتروني غير صالح");
        }
        if (!this.validatePhone(formData.phone)) {
            errors.push("رقم الهاتف غير صالح");
        }
        // يمكن إضافة المزيد من عمليات التحقق هنا

        return errors;
    }
}