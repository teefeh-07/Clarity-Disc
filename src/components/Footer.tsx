
import React from 'react';

export const Footer = () => {
    return (
        <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid #eaeaea' }}>
            <p>&copy; {new Date().getFullYear()} Clarity Disc Project. All rights reserved.</p>
        </footer>
    );
};
