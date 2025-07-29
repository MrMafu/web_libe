export default function Navbar() {
    return (
        <div>
            <nav className="navbar">
                <div className="nav-left">
                    <div className="navbar-brand">
                        <h1 className="logo">LibE</h1>
                    </div>
                    <ul className="nav-links">
                        <li><a href="/" className="nav-link">Home</a></li>
                        <li><a href="/library" className="nav-link">Library</a></li>
                        <li><a href="/genres" className="nav-link">Topics</a></li>
                    </ul>
                </div>
                
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                    <button className="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
                
                <div className="nav-right">
                    <a href="/profile" className="nav-link profile-link">
                        <span className="profile-icon"></span>
                    </a>
                </div>
            </nav>
            <style>{`
                .navbar {
                    background: linear-gradient(135deg, #424242ff, #7d7d7dff);
                    color: white;
                    padding: 15px 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .nav-left {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }
                
                .navbar-brand {
                    display: flex;
                    flex-direction: column;
                }
                
                .logo {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
                    letter-spacing: 1px;
                }
                
                .nav-links {
                    list-style: none;
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    margin: 0;
                    padding: 0;
                }
                
                .nav-link {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 16px;
                    padding: 8px 12px;
                    border-radius: 20px;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .nav-link:hover {
                    background-color: rgba(72, 141, 146, 0.2);
                    transform: translateY(-2px);
                }
                
                .search-bar {
                    display: flex;
                    flex-grow: 1;
                    max-width: 500px;
                    margin: 0 30px;
                    color: black;
                }
                
                .search-bar input {
                    width: 100%;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 10px 0 0 10px;
                    font-size: 14px;
                    background-color: rgba(255, 255, 255, 0.9);
                    transition: all 0.3s ease;
                }
                
                .search-bar input:focus {
                    outline: none;
                    background-color: white;
                    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
                }
                
                .search-button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 0 25px 25px 0;
                    background-color: #495a5eff;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .search-button:hover {
                    background-color: #000000ff;
                }
                
                .search-button svg {
                    width: 18px;
                    height: 18px;
                }
                
                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .profile-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .profile-link:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .profile-icon {
                    font-size: 18px;
                }
                
                @media (max-width: 1024px) {
                    .search-bar {
                        margin: 0 15px;
                    }
                }
                
                @media (max-width: 768px) {
                    .navbar {
                        flex-wrap: wrap;
                        padding: 15px;
                        gap: 15px;
                    }
                    
                    .nav-left {
                        order: 1;
                        width: 100%;
                        justify-content: space-between;
                    }
                    
                    .search-bar {
                        order: 3;
                        width: 100%;
                        max-width: 100%;
                        margin: 10px 0 0 0;
                    }
                    
                    .nav-right {
                        order: 2;
                    }
                    
                    .logo {
                        font-size: 24px;
                    }
                    
                    .nav-links {
                        gap: 10px;
                    }
                }
            `}</style>
        </div>
    );
}