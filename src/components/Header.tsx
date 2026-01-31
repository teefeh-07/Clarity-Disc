
import React from 'react';

export const Header = () => {
    return (
        <header style={{ padding: '20px', borderBottom: '1px solid #eaeaea', marginBottom: '20px' }}>
            <h1>Clarity Disc</h1>
            <nav>
                <a href="/" style={{ marginRight: '10px' }}>Home</a>
                <a href="/about">About</a>
            </nav>
        </header>
    );
};
