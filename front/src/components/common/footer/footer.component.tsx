import React from 'react';
import './footer.component.scss';

export const FooterComponent = (): JSX.Element => {
    return (
        <footer>
            <h3>© {new Date().getFullYear()}, all rights reserved</h3>
        </footer>
    );
}
