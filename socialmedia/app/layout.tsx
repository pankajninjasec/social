
import React, { ReactNode } from 'react';
import Link from 'next/link';
import Nav from './_components/nav/nav';
import { Toaster } from 'react-hot-toast';


interface LayoutProps {
    props: ReactNode;
}

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <>
            <Nav />
            <main>
                {children}
            </main>
            <Toaster />
        </>
    );
};

export default Layout;


