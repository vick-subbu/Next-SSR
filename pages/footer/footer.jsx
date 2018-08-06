import React from 'react';
import './_footer.scss';
class Footer extends React.Component {

    render() {

        let isWhiteLabel = false,
        useThriventFooter = false,
        isRoot = true;
        let data = {};
        data.footerlogourl = "https://cotribute.s3.amazonaws.com/p/images/events/cotribute-community-logo-dark.png";
        data.logoalt = "https://cotribute.s3.amazonaws.com/p/images/events/cotribute-community-logo-dark.png";

        let loadFromApplication =true;
        return (
            <div className="platform-footer" >

                {!isWhiteLabel && !useThriventFooter &&
                    <div className="constrain">
                        <div className="footer-brand brand-meta">
                            {isRoot &&
                                <h5>Empowered by</h5>}
                            <a>
                                <img className="logo" src={data.footerlogourl} alt={data.logoalt} src="https://cotribute.s3.amazonaws.com/p/images/events/cotribute-community-logo-dark.png"></img>
                                <h3 className="brand-name">{data.logoalt}</h3>
                            </a>
                            {
                           
                                // <a className="brand-copyright">Copyright Notice</a>
                            }
                        </div>
                        {loadFromApplication &&
                            <div className="footer-meta meta-stacked">
                                {!isRoot &&
                                    <div className="footer-brand">
                                        <h5>Empowered by</h5>
                                        <a>
                                            <img className="logo" alt="Co.tribute" src="https://cotribute.s3.amazonaws.com/p/images/events/cotribute-community-logo-dark.png"></img>
                                            <h3 className="brand-name">Co.tribute</h3>
                                        </a>
                                    </div>
                                }

                                <div className="service-info">
                                    <a>Privacy Policy</a>
                                    <b>|</b>
                                    <a>Terms of Use</a>
                                </div>
                            </div>
                        }
                    </div>
                }


                
            </div >
        )
    }
}
export default Footer;