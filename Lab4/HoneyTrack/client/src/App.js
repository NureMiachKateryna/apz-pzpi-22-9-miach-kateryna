// client/src/App.js
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HoneyBatchesPage from './pages/HoneyBatchesPage';
import StorageLocationsPage from './pages/StorageLocationsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';


import './App.css'; 

export const AuthContext = React.createContext(null);

const ProtectedRoute = () => {
    const { authState } = useContext(AuthContext);
    if (authState.isLoading) {
        return <div className="page-container" style={{ textAlign: 'center', paddingTop: '50px' }}><p>Перевірка аутентифікації...</p></div>;
    }
    return authState.token ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
    const { authState } = useContext(AuthContext);
    if (authState.isLoading) {
        return <div className="page-container" style={{ textAlign: 'center', paddingTop: '50px' }}><p>Перевірка аутентифікації...</p></div>;
    }
    if (!authState.token) {
        return <Navigate to="/login" replace />;
    }
    return authState.user?.role === 'ROLE_ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
    const { t, i18n } = useTranslation();

    const [authState, setAuthState] = React.useState({
        token: null,
        user: null,
        isLoading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        let user = null;
        if (userString) {
            try {
                user = JSON.parse(userString);
            } catch (e) {
                console.error("Error parsing user from localStorage in App.js on mount:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setAuthState({ token: token, user: user, isLoading: false });
    }, []);


    const setAuthData = (data) => {
        if (data && data.token && data.user) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setAuthState({ token: data.token, user: data.user, isLoading: false });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuthState({ token: null, user: null, isLoading: false });
        }
    };

    const logout = () => {
        setAuthData(null);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    if (authState.isLoading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>{t('common.loadingApp', 'Завантаження програми...')}</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ authState, setAuthData, logout }}>
            <Router>
                <div>
                    <nav>
                        <ul>
                            {authState.token && (
                                <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>{t('nav.dashboard', 'Головна')}</NavLink></li>
                            )}
                            
                            {!authState.token ? (
                                <>
                                    <li><NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>{t('nav.login', 'Вхід')}</NavLink></li>
                                    <li><NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>{t('nav.register', 'Реєстрація')}</NavLink></li>
                                </>
                            ) : (
                                <>
                                    <li><NavLink to="/honey-batches" className={({ isActive }) => (isActive ? "active" : "")}>{t('nav.honeyBatches', 'Партії меду')}</NavLink></li>
                                    <li><NavLink to="/storage-locations" className={({ isActive }) => (isActive ? "active" : "")}>{t('nav.storageLocations', 'Місця зберігання')}</NavLink></li>
                                    <li><NavLink to="/notification-settings" className={({ isActive }) => (isActive ? "active" : "")}>{t('nav.notificationSettings', 'Налаштування сповіщень')}</NavLink></li>
                                    {authState.user?.role === 'ROLE_ADMIN' && (
                                        <li><NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>{t('nav.adminUsers', 'Управління користувачами')}</NavLink></li>
                                    )}
                                    <li style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                        <button onClick={() => changeLanguage('uk')} disabled={i18n.language === 'uk' || i18n.language.startsWith('uk-')} style={{ marginRight: '5px', padding: '6px 10px', fontSize: '0.9em' }}>УКР</button>
                                        <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en' || i18n.language.startsWith('en-')} style={{ marginRight: '15px', padding: '6px 10px', fontSize: '0.9em' }}>ENG</button>
                                        <button onClick={logout} className="logout-button">{t('nav.logout', 'Вихід')} ({authState.user?.username})</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                    <hr />
                    <div className="page-container">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/honey-batches" element={<HoneyBatchesPage />} />
                                <Route path="/storage-locations" element={<StorageLocationsPage />} />
                                <Route path="/notification-settings" element={<NotificationSettingsPage />} />
                            </Route>

                            <Route element={<AdminRoute />}>
                                <Route path="/admin/users" element={<AdminUsersPage />} />
                            </Route>
                            
                            {/* <Route path="*" element={<NotFoundPage />} /> Якщо є NotFoundPage */}
                            <Route path="*" element={<Navigate to={authState.token ? "/" : "/login"} replace />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
