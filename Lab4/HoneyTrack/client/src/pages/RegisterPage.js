import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../services/authService';

function RegisterPage() {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (password !== confirmPassword) {
            setError(t('registerPage.passwordsDoNotMatch', 'Паролі не співпадають!'));
            return;
        }
        try {
            await registerUser({ username, email, password });
            setSuccessMessage(t('registerPage.registrationSuccess', 'Реєстрація успішна! Тепер ви можете увійти.'));
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || t('registerPage.registrationFailed', 'Registration failed. Please try again.'));
            console.error("Registration error:", err.response || err);
        }
    };

    return (
        <div>
            <h2>{t('registerPage.title')}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{t('registerPage.usernameLabel')}</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>{t('registerPage.emailLabel')}</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>{t('registerPage.passwordLabel')}</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>{t('registerPage.confirmPasswordLabel')}</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button type="submit">{t('registerPage.registerButton')}</button>
            </form>
        </div>
    );
}

export default RegisterPage;