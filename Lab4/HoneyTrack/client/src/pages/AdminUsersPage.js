// client/src/pages/AdminUsersPage.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllUsersAdmin, updateUserRoleAdmin, updateUserActiveStatusAdmin } from '../services/adminService';
import { AuthContext } from '../App';

function AdminUsersPage() {
   const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { authState } = useContext(AuthContext);

    const fetchUsers = useCallback(async () => {
        if (authState.token && authState.user?.role === 'ROLE_ADMIN') {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');
            try {
                const data = await getAllUsersAdmin();
                setUsers(data);
            } catch (err) {
                setError(err.data?.message || err.message || t('adminUsersPage.fetchError', 'Failed to fetch users.'));
            } finally {
                setIsLoading(false);
            }
        } else {
            setUsers([]); 
        }
    }, [authState.token, authState.user?.role, t]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (targetUserId, newRole) => {
        setError('');
        setSuccessMessage('');
        if (!newRole) {
            setError(t('adminUsersPage.selectNewRoleError', "Будь ласка, виберіть нову роль."));
            return;
        }
        if (authState.user?.user_id === targetUserId) {
            setError(t('adminUsersPage.cannotChangeOwnRoleError', "Ви не можете змінити власну роль."));
            return;
        }
        try {
            await updateUserRoleAdmin(targetUserId, newRole);
            setSuccessMessage(t('adminUsersPage.roleUpdateSuccess', { userId: targetUserId, role: newRole }, `Роль для користувача ID ${targetUserId} успішно змінено на ${newRole}.`));
            fetchUsers();
        } catch (err) {
            setError(err.data?.message || err.message || t('adminUsersPage.roleUpdateFailed', 'Failed to update user role.'));
        }
    };

    const handleActiveStatusChange = async (targetUserId, currentIsActive) => {
        setError('');
        setSuccessMessage('');
        if (authState.user?.user_id === targetUserId && currentIsActive) {
            setError(t('adminUsersPage.cannotDeactivateSelfError', "Ви не можете деактивувати власний обліковий запис."));
            return;
        }
        try {
            const newIsActive = !currentIsActive;
            await updateUserActiveStatusAdmin(targetUserId, newIsActive);
            setSuccessMessage(t('adminUsersPage.statusUpdateSuccess', { userId: targetUserId, status: newIsActive ? t('common.active', 'активний') : t('common.inactive', 'неактивний') }, `Статус користувача ID ${targetUserId} успішно змінено на ${newIsActive ? 'активний' : 'неактивний'}.`));
            fetchUsers();
        } catch (err) {
            setError(err.data?.message || err.message || t('adminUsersPage.statusUpdateFailed', 'Failed to update user active status.'));
        }
    };

    if (isLoading) return <div className="page-container"><p>{t('common.loadingUsers', 'Завантаження користувачів...')}</p></div>;

    return (
        <div>
            <h1>{t('adminUsersPage.title', 'Управління Користувачами (Адмін)')}</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            {users.length === 0 && !isLoading && (
                <p>{t('adminUsersPage.noUsersFound', 'Користувачів не знайдено.')}</p>
            )}

            {users.length > 0 && (
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>{t('adminUsersPage.tableId', 'ID')}</th>
                            <th>{t('adminUsersPage.tableUsername', "Ім'я користувача")}</th>
                            <th>{t('adminUsersPage.tableEmail', 'Email')}</th>
                            <th>{t('adminUsersPage.tableCurrentRole', 'Поточна Роль')}</th>
                            <th>{t('adminUsersPage.tableChangeRole', 'Змінити Роль')}</th>
                            <th>{t('adminUsersPage.tableActive', 'Активний')}</th>
                            <th>{t('adminUsersPage.tableActionStatus', 'Дія (Статус)')}</th>
                            <th>{t('adminUsersPage.tableDateCreated', 'Дата створення')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{t(`roles.${user.role}`, user.role)}</td>
                                <td>
                                    {authState.user?.user_id !== user.user_id ? (
                                        <select
                                            className="role-select"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                            aria-label={t('adminUsersPage.changeRoleFor', { username: user.username }, `Змінити роль для ${user.username}`)}
                                        >
                                            <option value="ROLE_USER">{t('roles.ROLE_USER', 'ROLE_USER')}</option>
                                            <option value="ROLE_ADMIN">{t('roles.ROLE_ADMIN', 'ROLE_ADMIN')}</option>
                                        </select>
                                    ) : (
                                        t(`roles.${user.role}`, user.role)
                                    )}
                                </td>
                                <td>{user.is_active ? t('common.yes', 'Так') : t('common.no', 'Ні')}</td>
                                <td>
                                    {authState.user?.user_id !== user.user_id ? (
                                        <button
                                            onClick={() => handleActiveStatusChange(user.user_id, user.is_active)}
                                            className={`action-button ${user.is_active ? 'deactivate-button' : 'activate-button'}`}
                                        >
                                            {user.is_active ? t('adminUsersPage.deactivateButton', 'Деактивувати') : t('adminUsersPage.activateButton', 'Активувати')}
                                        </button>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td>{new Date(user.createdAt).toLocaleString(i18n.language)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminUsersPage;