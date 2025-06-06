import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../services/authService';
import { AuthContext } from '../App';

function LoginPage() {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setAuthData } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await loginUser({ username, password });
            setAuthData(response.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || t('loginPage.errorMessage', 'Login failed. Please try again.'));
            console.error("Login error:", err.response || err);
        }
    };

    return (
        <div>
            <h2>{t('loginPage.title')}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{t('loginPage.usernameLabel')}</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>{t('loginPage.passwordLabel')}</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">{t('loginPage.loginButton')}</button>
            </form>
        </div>
    );
}

export default LoginPage;