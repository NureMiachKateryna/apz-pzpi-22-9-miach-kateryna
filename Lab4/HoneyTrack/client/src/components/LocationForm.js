// client/src/components/LocationForm.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function LocationForm({ onSubmit, initialData = {}, onCancel, isEditing }) {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setName(initialData.name || '');
        setDescription(initialData.description || '');
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!name) {
            setFormError(t('storageLocationsPage.form.nameRequiredError', "Назва місця зберігання є обов'язковою."));
            return;
        }
        onSubmit({ name, description });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h3>{isEditing ? t('storageLocationsPage.form.editTitle', 'Редагувати місце зберігання') : t('storageLocationsPage.form.addTitle', 'Додати нове місце зберігання')}</h3>
            {formError && <p className="error-message">{formError}</p>}
            <div>
                <label>{t('storageLocationsPage.form.nameLabel', 'Назва місця:')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>{t('storageLocationsPage.form.descriptionLabel', 'Опис (опціонально):')}</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>
                {isEditing ? t('storageLocationsPage.form.saveChangesButton', 'Зберегти зміни') : t('storageLocationsPage.form.saveButton', 'Зберегти місце')}
            </button>
            <button type="button" onClick={onCancel} style={{ marginTop: '10px', marginLeft: '10px' }}>
                {t('common.cancelButton', 'Скасувати')}
            </button>
        </form>
    );
}

export default LocationForm;