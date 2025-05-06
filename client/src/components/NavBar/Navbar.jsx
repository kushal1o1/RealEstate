import React, { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar  -between items-center h-[100px] px-4 md:px-8">
            <div className="flex-[3] flex items-center gap-4">
                <a className="font-medium text-2xl flex items-center gap-2">
                    <img src="./logo.png" className="w-7" alt="Logo" />
                    <span>RealEstate</span>
                </a>
                <div className="hidden md:flex gap-6">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/properties">Agents</a>
                </div>
            </div>
            <div className="flex-[5] flex items-center justify-end">
                <div className="hidden md:flex gap-4">
                    <a href="/">Signin</a>
                    <a className="bg-yellow-300 px-4 py-2 rounded" href="/">SignOut</a>
                </div>
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <img src="./menu" alt="Menu" className="w-6" />
                </button>
            </div>
            {isMenuOpen && (
                <div className="absolute top-[100px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/properties">Agents</a>
                    <a href="/">Signin</a>
                    <a className="bg-yellow-300 px-4 py-2 rounded" href="/">SignOut</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
