import React from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import Team from '../components/Sections/Team';

const TeamPage: React.FC = () => {
    return (
        <>
            <NavbarRedesigned />
            <main style={{ paddingTop: '100px', minHeight: 'calc(100vh - 200px)', background: '#f8fafc' }}>
                <Team />
            </main>
            <Footer />
        </>
    );
};

export default TeamPage;
