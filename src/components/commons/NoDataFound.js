import React from 'react';

const NoDataFound=(props)=> {
    return (
        <div className="error-box">
            <div className="error-img">
                <img src="/img/no_data.png" className="img-fluid" alt="" style={{height:"300px"}}/>
            </div>
            <h3 className="h2 mb-3 empty_section_title" >Désolé !</h3>
            <p className="empty_section_paragraph">Nous n'avons trouvé {props.name}.</p>
        </div>
    );
}

export default NoDataFound;