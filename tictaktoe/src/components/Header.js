import React from 'react';

const Header = ({titleName, author, git, gitIcon}) => {
    return(
        <div className="App-header">
            <a href='#'>
                <div className='author'>
                    <img id='github_icon' alt='/redux' src={gitIcon}/>
                    <span id='author_span'>
                        {author}
                    </span>
                </div>
            </a>
            <br />
            <p>{titleName}</p>
            <hr />
        </div>
    )
};

export default Header;
