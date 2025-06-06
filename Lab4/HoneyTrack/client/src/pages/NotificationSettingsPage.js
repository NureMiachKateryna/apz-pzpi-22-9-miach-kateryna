// client/src/pages/NotificationSettingsPage.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getMyNotificationSettings, setNotificationSetting } from '../services/notificationSettingService';
import { getAllSensorsForUser } from '../services/sensorService';
import { AuthContext } from '../App';

function NotificationSettingsPage() {
    const { t, i18n } = useTranslation();
    const [settings, setSettings] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [currentSensorId, setCurrentSensorId] = useState('');
    const [parameterType, setParameterType] = useState('temperature');
    const [minThreshold, setMinThreshold] = useState('');
    const [maxThreshold, setMaxThreshold] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);
    const [editingSettingId, setEditingSettingId] = useState(null);

    const { authState } = useContext(AuthContext);

    const fetchData = useCallback(async () => {
        if (!authState.token) return;
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const [settingsData, sensorsData] = await Promise.all([
                getMyNotificationSettings().catch(e => { console.error("NSPage: Failed to fetch settings", e); return []; }),
                getAllSensorsForUser().catch(e => { console.error("NSPage: Failed to fetch sensors", e); return []; })
            ]);
            setSettings(settingsData || []);
            const validSensors = sensorsData || [];
            setSensors(validSensors);

            if (validSensors.length > 0 && currentSensorId === '') {
                loadSettingIntoForm(validSensors[0].sensor_id, parameterType, settingsData || []);
            } else if (currentSensorId !== '') {
                loadSettingIntoForm(currentSensorId, parameterType, settingsData || []);
            } else if (validSensors.length === 0 && !validSensors.find(s => s.sensor_id === 'VIRTUAL_DHT_01') && currentSensorId === '') {
                loadSettingIntoForm('VIRTUAL_DHT_01', parameterType, settingsData || []);
            }

        } catch (err) {
            setError(err.data?.message || err.message || t('notificationSettingsPage.fetchError', 'Failed to fetch data.'));
        } finally {
            setIsLoading(false);
        }
    }, [authState.token, t]); 

    const loadSettingIntoForm = useCallback((sensorIdToLoad, paramTypeToLoad, currentSettings = settings) => {
        setCurrentSensorId(sensorIdToLoad || (sensors.length > 0 ? sensors[0].sensor_id : 'VIRTUAL_DHT_01'));
        setParameterType(paramTypeToLoad || 'temperature');
        
        const targetSensor = sensorIdToLoad || (sensors.length > 0 ? sensors[0].sensor_id : 'VIRTUAL_DHT_01');
        const targetParam = paramTypeToLoad || 'temperature';

        const existingSetting = currentSettings.find(s => s.sensor_id === targetSensor && s.parameter_type === targetParam);
        
        if (existingSetting) {
            setMinThreshold(existingSetting.min_threshold !== null ? String(existingSetting.min_threshold) : '');
            setMaxThreshold(existingSetting.max_threshold !== null ? String(existingSetting.max_threshold) : '');
            setIsEnabled(existingSetting.is_enabled);
            setEditingSettingId(existingSetting.setting_id);
        } else {
            setMinThreshold('');
            setMaxThreshold('');
            setIsEnabled(true);
            setEditingSettingId(null);
        }
        setSuccessMessage('');
        setError('');
    }, [settings, sensors]);


    useEffect(() => {
        fetchData();
   
    }, [authState.token]); 

    useEffect(() => {
       
        if (currentSensorId || (sensors.length > 0 && currentSensorId === '')) {
            loadSettingIntoForm(currentSensorId || (sensors.length > 0 ? sensors[0].sensor_id : 'VIRTUAL_DHT_01'), parameterType);
        }
    
    }, [currentSensorId, parameterType, sensors, settings, loadSettingIntoForm]);


    const resetForm = () => {
        const firstSensorId = sensors.length > 0 ? sensors[0].sensor_id : 'VIRTUAL_DHT_01';
        setCurrentSensorId(firstSensorId);
        setParameterType('temperature');
        loadSettingIntoForm(firstSensorId, 'temperature'); 
        setError('');
        setSuccessMessage('');
    };
    

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!currentSensorId || !parameterType) {
            setError(t('notificationSettingsPage.selectSensorAndParamError'));
            return;
        }
        if (isEnabled && minThreshold === '' && maxThreshold === '') {
            setError(t('notificationSettingsPage.setOneThresholdError'));
            return;
        }
        if (minThreshold !== '' && maxThreshold !== '' && parseFloat(minThreshold) >= parseFloat(maxThreshold)) {
            setError(t('notificationSettingsPage.minMaxThresholdError'));
            return;
        }

        const settingData = {
            sensor_id: currentSensorId,
            parameter_type: parameterType,
            min_threshold: minThreshold === '' ? null : parseFloat(minThreshold),
            max_threshold: maxThreshold === '' ? null : parseFloat(maxThreshold),
            is_enabled: isEnabled,
        };
        
        try {
            await setNotificationSetting(settingData);
            setSuccessMessage(t('notificationSettingsPage.saveSuccess'));
            fetchData(); 
        } catch (err) {
            setError(err.data?.message || err.message || t('notificationSettingsPage.saveError'));
        }
    };
    
    if (isLoading && settings.length === 0) return <div className="page-container"><p>{t('common.loadingNotificationSettings')}</p></div>;

    return (
        <div>
            <h1>{t('notificationSettingsPage.title')}</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <form onSubmit={handleFormSubmit} className="styled-form">
                <h3>{editingSettingId ? t('notificationSettingsPage.formTitleEdit', { sensorId: currentSensorId, parameterType: t(`notificationSettingsPage.${parameterType}Option`) } ) : t('notificationSettingsPage.formTitleAddUpdate')}</h3>
                <div>
                    <label htmlFor="sensorSelect">{t('notificationSettingsPage.sensorLabel')}</label>
                    <select id="sensorSelect" value={currentSensorId} onChange={(e) => setCurrentSensorId(e.target.value)}>
                        <option value="" disabled={sensors.length > 0 && currentSensorId !== ""}>{t('notificationSettingsPage.selectSensor')}</option>
                        {!sensors.find(s => s.sensor_id === 'VIRTUAL_DHT_01') && (
                            <option value="VIRTUAL_DHT_01">{t('notificationSettingsPage.generalSensorOption', { sensorId: 'VIRTUAL_DHT_01' })}</option>
                        )}
                        {sensors.map(sensor => (
                            <option key={sensor.sensor_id} value={sensor.sensor_id}>
                                {sensor.name || sensor.sensor_id}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="paramTypeSelect">{t('notificationSettingsPage.parameterTypeLabel')}</label>
                    <select id="paramTypeSelect" value={parameterType} onChange={(e) => setParameterType(e.target.value)}>
                        <option value="temperature">{t('notificationSettingsPage.temperatureOption')}</option>
                        <option value="humidity">{t('notificationSettingsPage.humidityOption')}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="minThreshold">{t('notificationSettingsPage.minThresholdLabel')}</label>
                    <input id="minThreshold" type="number" step="0.1" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} placeholder={t('notificationSettingsPage.minThresholdPlaceholder')} />
                </div>
                <div>
                    <label htmlFor="maxThreshold">{t('notificationSettingsPage.maxThresholdLabel')}</label>
                    <input id="maxThreshold" type="number" step="0.1" value={maxThreshold} onChange={(e) => setMaxThreshold(e.target.value)} placeholder={t('notificationSettingsPage.maxThresholdPlaceholder')} />
                </div>
                <div>
                    <label htmlFor="isEnabledCheckbox">
                        <input id="isEnabledCheckbox" type="checkbox" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                        {t('notificationSettingsPage.enabledLabel')}
                    </label>
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>{t('notificationSettingsPage.saveSettingsButton')}</button>
                <button type="button" onClick={resetForm} style={{ marginTop: '10px', marginLeft: '10px' }}>{t('notificationSettingsPage.resetFormButton')}</button>
            </form>

            <h2>{t('notificationSettingsPage.currentSettingsTitle')}</h2>
            {settings.length === 0 && !isLoading && (
                <p>{t('notificationSettingsPage.noSettings')}</p>
            )}
            {settings.length > 0 && (
                <ul className="item-list">
                    {settings.map(setting => (
                        <li key={setting.setting_id}>
                            <strong>{t('notificationSettingsPage.sensorLabel')}</strong> {setting.Sensor?.name || setting.sensor_id} <br />
                            <strong>{t('notificationSettingsPage.paramLabel')}</strong> {setting.parameter_type === 'temperature' ? t('notificationSettingsPage.temperatureOption') : t('notificationSettingsPage.humidityOption')} <br />
                            <strong>{t('notificationSettingsPage.limitsLabel')}</strong>
                            {setting.min_threshold !== null ? t('notificationSettingsPage.fromMin', {min: setting.min_threshold}) : t('notificationSettingsPage.noLimit')}
                            {setting.max_threshold !== null ? t('notificationSettingsPage.toMax', {max: setting.max_threshold}) : t('notificationSettingsPage.noLimit')}
                            ({setting.is_enabled ? t('notificationSettingsPage.statusEnabled') : t('notificationSettingsPage.statusDisabled')})
                            <button 
                                onClick={() => loadSettingIntoForm(setting.sensor_id, setting.parameter_type)}
                                className="action-button"
                            >
                                {t('common.editButton')}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NotificationSettingsPage;