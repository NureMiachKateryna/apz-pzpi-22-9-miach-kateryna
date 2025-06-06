import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../App';
import { getAllHoneyBatches, getStorageLocations } from '../services/honeyBatchService';
import { getRecentUnreadAlerts } from '../services/alertService';

const cardStyle = {
    backgroundColor: '#FFF8E1',
    border: '1px solid #FFECB3',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.07)'
};
const statValueStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#E65100'
};

function DashboardPage() {
    const { t, i18n } = useTranslation();
    const { authState } = useContext(AuthContext);
    const [stats, setStats] = useState({ honeyBatches: 0, storageLocations: 0, sensors: 0 });
    const [recentAlerts, setRecentAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        if (!authState.token) return;
        setIsLoading(true);
        setError('');
        try {
            const [batchesData, locationsData, alertsData] = await Promise.all([
                getAllHoneyBatches().catch(e => { console.error("Failed to fetch batches", e); return []; }),
                getStorageLocations().catch(e => { console.error("Failed to fetch locations", e); return []; }),
                getRecentUnreadAlerts(3).catch(e => { console.error("Failed to fetch alerts", e); return []; })
            ]);
            setStats({
                honeyBatches: batchesData.length,
                storageLocations: locationsData.length,
            });
            setRecentAlerts(alertsData || []);
        } catch (err) {
            setError(err.data?.message || err.message || t('dashboardPage.fetchError', 'Не вдалося завантажити дані для дашборду.'));
            console.error("Dashboard fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [authState.token, t]);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    if (isLoading && recentAlerts.length === 0 && stats.honeyBatches === 0) {
         return <div className="page-container"><p>{t('common.loadingDashboard', 'Завантаження дашборду...')}</p></div>;
    }

    return (
        <div>
            <h1>{t('dashboardPage.title')}</h1>
            {authState.user && <p style={{fontSize: '1.2em', marginBottom: '25px'}}>{t('dashboardPage.welcome', { username: authState.user.username })}</p>}
            {error && <p className="error-message">{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: '30px' }}>
                <div style={{...cardStyle, flexBasis: '200px', textAlign: 'center'}}>
                    <h3>{t('dashboardPage.honeyBatchesCardTitle')}</h3>
                    <p style={statValueStyle}>{stats.honeyBatches}</p>
                    <Link to="/honey-batches">{t('dashboardPage.viewAllLink')}</Link>
                </div>
                <div style={{...cardStyle, flexBasis: '200px', textAlign: 'center'}}>
                    <h3>{t('dashboardPage.storageLocationsCardTitle')}</h3>
                    <p style={statValueStyle}>{stats.storageLocations}</p>
                    <Link to="/storage-locations">{t('dashboardPage.manageLink')}</Link>
                </div>
            </div>

            <div style={cardStyle}>
                <h3>{t('dashboardPage.recentAlertsTitle')}</h3>
                {recentAlerts.length > 0 ? (
                    <ul style={{paddingLeft: '20px', listStyle: 'none'}}>
                        {recentAlerts.map(alert => (
                            <li key={alert.alert_id} style={{marginBottom: '10px', padding: '8px', borderLeft: `5px solid ${alert.alert_level === 'critical' ? 'red' : 'orange'}`}}>
                                <strong>[{new Date(alert.timestamp).toLocaleTimeString(i18n.language)}]</strong> {alert.message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{t('dashboardPage.noNewAlerts')}</p>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;