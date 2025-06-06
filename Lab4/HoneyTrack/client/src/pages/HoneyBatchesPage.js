// client/src/pages/HoneyBatchesPage.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    getAllHoneyBatches,
    createHoneyBatch,
    updateHoneyBatch,
    deleteHoneyBatch,
    getStorageLocations
} from '../services/honeyBatchService';
import { AuthContext } from '../App';

const BatchForm = ({ onSubmit, initialData = {}, storageLocations = [], onCancel, isEditing }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData.name || '');
    const [sort, setSort] = useState(initialData.sort || '');
    const [quantity, setQuantity] = useState(initialData.quantity || '');
    const [unit, setUnit] = useState(initialData.unit || '');
    const [collectionDate, setCollectionDate] = useState(initialData.collection_date ? initialData.collection_date.split('T')[0] : '');
    const [notes, setNotes] = useState(initialData.notes || '');
    const [storageLocationId, setStorageLocationId] = useState(initialData.storage_location_id || '');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setName(initialData.name || '');
        setSort(initialData.sort || '');
        setQuantity(initialData.quantity || '');
        setUnit(initialData.unit || '');
        setCollectionDate(initialData.collection_date ? initialData.collection_date.split('T')[0] : '');
        setNotes(initialData.notes || '');
        setStorageLocationId(initialData.storage_location_id || '');
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!name || !sort || !quantity) {
            setFormError(t('honeyBatchesPage.form.requiredFieldsError', "Назва, сорт та кількість є обов'язковими."));
            return;
        }
        const batchData = {
            name,
            sort,
            quantity: parseFloat(quantity),
            unit,
            collection_date: collectionDate || null,
            notes,
            storage_location_id: storageLocationId ? parseInt(storageLocationId) : null,
        };
        onSubmit(batchData);
    };

    return (
        <form onSubmit={handleSubmit} className="styled-form">
            <h3>{isEditing ? t('honeyBatchesPage.form.editTitle') : t('honeyBatchesPage.form.addTitle')}</h3>
            {formError && <p className="error-message">{formError}</p>}
            <div>
                <label htmlFor={`batch-name-${isEditing ? initialData.batch_id : 'new'}`}>{t('honeyBatchesPage.form.nameLabel')}</label>
                <input id={`batch-name-${isEditing ? initialData.batch_id : 'new'}`} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label htmlFor={`batch-sort-${isEditing ? initialData.batch_id : 'new'}`}>{t('honeyBatchesPage.form.sortLabel')}</label>
                <input id={`batch-sort-${isEditing ? initialData.batch_id : 'new'}`} type="text" value={sort} onChange={(e) => setSort(e.target.value)} required />
            </div>
            <div>
                <label htmlFor={`batch-quantity-${isEditing ? initialData.batch_id : 'new'}`}>{t('honeyBatchesPage.form.quantityLabel')}</label>
                <input id={`batch-quantity-${isEditing ? initialData.batch_id : 'new'}`} type="number" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div>
                <label htmlFor={`batch-unit-${isEditing ? initialData.batch_id : 'new'}`}>{t('honeyBatchesPage.form.unitLabel')}</label>
                <input id={`batch-unit-${isEditing ? initialData.batch_id : 'new'}`} type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            <div>
                <label htmlFor={`batch-collectionDate-${isEditing ? initialData.batch_id : 'new'}`}>{t('honeyBatchesPage.form.collectionDateLabel')}</label>
                <input id={`batch-collectionDate-${isEditing ? initialData.batch_id : 'new'}`} type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
            </div>
            <div>
                <label htmlFor={`batch-storageLocation-${isEditing ? initialData.batch_id : 'new'}`}>{t('honeyBatchesPage.form.storageLocationLabel')}</label>
                <select id={`batch-storageLocation-${isEditing ? initialData.batch_id : 'new'}`} value={storageLocationId} onChange={(e) => setStorageLocationId(e.target.value)}>
                    <option value="">{t('honeyBatchesPage.form.noLocationSelected')}</option>
                    {storageLocations.map(loc => (
                        <option key={loc.location_id} value={loc.location_id}>{loc.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor={`batch-notes-${isEditing ? initialData.batch_id : 'new'}`}>{t('honeyBatchesPage.form.notesLabel')}</label>
                <textarea id={`batch-notes-${isEditing ? initialData.batch_id : 'new'}`} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>
                {isEditing ? t('common.saveChangesButton') : t('honeyBatchesPage.form.saveButton')}
            </button>
            <button type="button" onClick={onCancel} style={{ marginTop: '10px', marginLeft: '10px' }}>
                {t('common.cancelButton')}
            </button>
        </form>
    );
};


function HoneyBatchesPage() {
    const { t, i18n } = useTranslation();
    const [batches, setBatches] = useState([]);
    const [storageLocations, setStorageLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);

    const { authState } = useContext(AuthContext);

    const fetchAllData = useCallback(async () => {
        if (!authState.token) return;
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const [batchesData, locationsData] = await Promise.all([
                getAllHoneyBatches().catch(e => {console.error(e); return [];}),
                getStorageLocations().catch(e => {console.error(e); return [];})
            ]);
            setBatches(batchesData || []);
            setStorageLocations(locationsData || []);
        } catch (err) {
            setError(err.data?.message || err.message || t('honeyBatchesPage.fetchError', 'Failed to fetch data.'));
        } finally {
            setIsLoading(false);
        }
    }, [authState.token, t]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleFormSubmit = async (batchData) => {
        setError('');
        setSuccessMessage('');
        try {
            if (editingBatch) {
                await updateHoneyBatch(editingBatch.batch_id, batchData);
                setSuccessMessage(t('honeyBatchesPage.updateSuccess', 'Honey batch updated successfully.'));
            } else {
                await createHoneyBatch(batchData);
                setSuccessMessage(t('honeyBatchesPage.createSuccess', 'New honey batch created successfully.'));
            }
            setShowForm(false);
            setEditingBatch(null);
            fetchAllData();
        } catch (err) {
            setError(err.data?.message || err.message || t(`honeyBatchesPage.${editingBatch ? 'updateError' : 'createError'}`, `Failed to ${editingBatch ? 'update' : 'create'} honey batch.`));
        }
    };

    const handleEdit = (batch) => {
        setEditingBatch(batch);
        setShowForm(true);
        setError('');
        setSuccessMessage('');
    };

    const handleDelete = async (batchId) => {
        if (window.confirm(t('honeyBatchesPage.confirmDelete', 'Ви впевнені, що хочете видалити цю партію меду?'))) {
            setError('');
            setSuccessMessage('');
            try {
                await deleteHoneyBatch(batchId);
                setSuccessMessage(t('honeyBatchesPage.deleteSuccess', 'Honey batch deleted successfully.'));
                fetchAllData();
            } catch (err) {
                setError(err.data?.message || err.message || t('honeyBatchesPage.deleteError', 'Failed to delete honey batch.'));
            }
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingBatch(null);
        setError('');
        setSuccessMessage('');
    };

    if (isLoading) return <div className="page-container"><p>{t('common.loadingHoneyBatches', 'Завантаження партій меду...')}</p></div>;

    return (
        <div>
            <h1>{t('honeyBatchesPage.title', 'Партії Меду')}</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            {!showForm && (
                <button onClick={() => { setEditingBatch(null); setShowForm(true); }} style={{marginBottom: '20px'}}>
                    {t('honeyBatchesPage.addNewButton', 'Додати нову партію')}
                </button>
            )}

            {showForm && (
                <BatchForm
                    onSubmit={handleFormSubmit}
                    initialData={editingBatch || {}}
                    storageLocations={storageLocations}
                    onCancel={handleCancelForm}
                    isEditing={!!editingBatch}
                />
            )}

            {batches.length === 0 && !isLoading && !showForm && (
                <p>{t('honeyBatchesPage.noBatches', "У вас ще немає жодної партії меду. Додайте першу!")}</p>
            )}

            {batches.length > 0 && (
                <ul className="item-list">
                    {batches.map(batch => (
                        <li key={batch.batch_id}>
                            <h3>{batch.name}</h3>
                            <p><strong>{t('honeyBatchesPage.sortHeader', 'Сорт:')}</strong> {batch.sort || t('common.notAvailable', 'N/A')}</p>
                            <p><strong>{t('honeyBatchesPage.quantityHeader', 'Кількість:')}</strong> {batch.quantity} {batch.unit || ''}</p>
                            <p><strong>{t('honeyBatchesPage.collectionDateHeader', 'Дата збору:')}</strong> {batch.collection_date ? new Date(batch.collection_date).toLocaleDateString(i18n.language) : t('common.notAvailable', 'N/A')}</p>
                            <p><strong>{t('honeyBatchesPage.storageLocationHeader', 'Місце зберігання:')}</strong> {batch.StorageLocation?.name || (batch.storage_location_id ? `ID: ${batch.storage_location_id}`: t('common.notAvailable', 'N/A'))}</p>
                            <p><strong>{t('honeyBatchesPage.notesHeader', 'Нотатки:')}</strong> {batch.notes || t('common.noNotes', 'Немає')}</p>
                            <p><strong>{t('common.createdLabel', 'Створено:')}</strong> {new Date(batch.createdAt).toLocaleString(i18n.language)}</p>
                            <p><strong>{t('common.updatedLabel', 'Оновлено:')}</strong> {new Date(batch.updatedAt).toLocaleString(i18n.language)}</p>
                            <button onClick={() => handleEdit(batch)} className="action-button">{t('common.editButton', 'Редагувати')}</button>
                            <button onClick={() => handleDelete(batch.batch_id)} className="action-button delete-button">
                                {t('common.deleteButton', 'Видалити')}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HoneyBatchesPage;