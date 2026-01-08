import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../store/authSlice';

export const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser);
    return { token, user, isAuthenticated: !!token };
};
