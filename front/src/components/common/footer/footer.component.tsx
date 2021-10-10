import React from 'react';
import './footer.component.scss';

export const FooterComponent = (): JSX.Element => {
    return (
        <footer>
            <span>© {new Date().getFullYear()}, all rights reserved</span>
        </footer>
    );
}
