// client/src/pages/StorageLocationsPage.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllStorageLocations, createStorageLocation, updateStorageLocation, deleteStorageLocation } from '../services/storageLocationService'; // <--- ЗМІНІТЬ НА ВАШ СЕРВІС
import { AuthContext } from '../App';
import LocationForm from '../components/LocationForm'; 

function StorageLocationsPage() {
    const { t, i18n } = useTranslation();
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const { authState } = useContext(AuthContext);

    const fetchLocations = useCallback(async () => {
        if (!authState.token) return;
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const data = await getAllStorageLocations();
            setLocations(data || []);
        } catch (err) {
            setError(err.data?.message || err.message || t('storageLocationsPage.fetchError', 'Failed to fetch storage locations.'));
        } finally {
            setIsLoading(false);
        }
    }, [authState.token, t]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    const handleFormSubmit = async (locationData) => {
        setError('');
        setSuccessMessage('');
        try {
            if (editingLocation) {
                await updateStorageLocation(editingLocation.location_id, locationData);
                setSuccessMessage(t('storageLocationsPage.updateSuccess', 'Місце зберігання успішно оновлено.'));
            } else {
                await createStorageLocation(locationData);
                setSuccessMessage(t('storageLocationsPage.createSuccess', 'Нове місце зберігання успішно створено.'));
            }
            setShowForm(false);
            setEditingLocation(null);
            fetchLocations();
        } catch (err) {
            setError(err.data?.message || err.message || t(`storageLocationsPage.${editingLocation ? 'updateError' : 'createError'}`, `Failed to ${editingLocation ? 'update' : 'create'} storage location.`));
        }
    };

    const handleEdit = (location) => {
        setEditingLocation(location);
        setShowForm(true);
        setError('');
        setSuccessMessage('');
    };

    const handleDelete = async (locationId) => {
        if (window.confirm(t('storageLocationsPage.confirmDelete', 'Ви впевнені, що хочете видалити це місце зберігання? УВАГА: Це може вплинути на партії меду та датчики, пов\'язані з ним.'))) {
            setError('');
            setSuccessMessage('');
            try {
                await deleteStorageLocation(locationId); 
                setSuccessMessage(t('storageLocationsPage.deleteSuccess', 'Місце зберігання успішно видалено.'));
                fetchLocations();
            } catch (err) {
                setError(err.data?.message || err.message || t('storageLocationsPage.deleteError', 'Failed to delete storage location.'));
            }
        }
    };
    
    const handleCancelForm = () => {
        setShowForm(false);
        setEditingLocation(null);
        setError('');
        setSuccessMessage('');
    };

    if (isLoading) return <div className="page-container"><p>{t('common.loadingStorageLocations', 'Завантаження місць зберігання...')}</p></div>;

    return (
        <div>
            <h1>{t('storageLocationsPage.title', 'Місця Зберігання')}</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {!showForm && (
                <button onClick={() => { setEditingLocation(null); setShowForm(true); }} style={{ marginBottom: '20px' }}>
                    {t('storageLocationsPage.addNewButton', 'Додати нове місце')}
                </button>
            )}

            {showForm && (
                <LocationForm
                    onSubmit={handleFormSubmit}
                    initialData={editingLocation || {}}
                    onCancel={handleCancelForm}
                    isEditing={!!editingLocation}
                />
            )}

            {locations.length === 0 && !isLoading && !showForm && (
                <p>{t('storageLocationsPage.noLocations', 'У вас ще немає жодного місця зберігання. Додайте перше!')}</p>
            )}

            {locations.length > 0 && (
                <ul className="item-list">
                    {locations.map(loc => (
                        <li key={loc.location_id}>
                            <h3>{loc.name}</h3>
                            <p><strong>{t('storageLocationsPage.descriptionLabel', 'Опис:')}</strong> {loc.description || t('common.notAvailable', 'N/A')}</p>
                            <p><strong>{t('common.createdLabel', 'Створено:')}</strong> {new Date(loc.createdAt).toLocaleString(i18n.language)}</p>
                            <button onClick={() => handleEdit(loc)} className="action-button">
                                {t('common.editButton', 'Редагувати')}
                            </button>
                            <button 
                                onClick={() => handleDelete(loc.location_id)} 
                                className="action-button delete-button"
                                style={{ marginLeft: '10px' }}
                            >
                                {t('common.deleteButton', 'Видалити')}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default StorageLocationsPage;