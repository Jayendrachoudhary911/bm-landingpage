import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({
    user: null,
    loading: true
});

export function AuthProvider({ children }) {
    const [state, setState] = useState({
        user: null,
        loading: true
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setState({
                user,
                loading: false
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={state}>
            {!state.loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}