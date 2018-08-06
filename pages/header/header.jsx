import React from 'react';
import './_menu.scss';
import './_mega_menu.scss';
import './_header.scss';
import './_new.scss';
import Ionicon from 'react-ionicons'
class Header extends React.Component {

createUrlAvatar(version, id, type, transform) {
    if (!version || !id) return ''
    transform = transform || 'avatar_thumb_lg'

    var file = (id.indexOf('.') > -1) ? '' : '.jpg'
    type = type || defaults.user
    version = (version || Config.CDN[type + 'DefaultVersion']) + '999/'
    id = id || Config.CDN[type + 'DefaultId']
    return  "https://res.cloudinary.com/cotribute/image/upload/" + 't_' + transform + ',d_default.jpg/' + version + id + file + ''.replace('\/\/', '/')
    }
checkDataAvatar(data) {

    function getChar ( str ) {
        if (str === undefined) return '';
        return str.charAt(0);
        }
    var imgVersion
    var imgId
    let  isUser = true;
    let imgType = 'user';
    let isCharity = false;
    
    let finalImagePath="";
    
    if (!data) {
        
        finalImagePath = (isUser) ? "https://res.cloudinary.com/cotribute/image/upload/d_default.jpg,q_40/default.jpg" : "https://res.cloudinary.com/cotribute/image/upload/d_default.jpg,q_40/default.jpg"
    } else {
        if (!isUser && !isCharity && data && data.organization && data.organization.logoVersion) {
        imgVersion = data.organization.logoVersion
        imgId =  data.organization.logoId
        } else if (!isUser && isCharity && data && data.charity && data.charity.logoVersion) {
        imgVersion = data.charity.logoVersion
        imgId =  data.charity.logoId
        } else if (data.imageVersion) {
        imgVersion = data.imageVersion
        imgId = data.imageId
        } else if (data && data.user && data.user.imageVersion) {
        imgVersion = data.user.imageVersion
        imgId = data.user.imageId
        } else if (data && data.inviter && data.inviter.imageVersion) {
        imgVersion = data.inviter.imageVersion
        imgId = data.inviter.imageId
        } else if (data && data.creator && data.creator.imageVersion) {
        imgVersion = data.creator.imageVersion
        imgId = data.creator.imageId
        }

        // we have no image data, default to initials
        let initials
        if ((!imgVersion && !imgId) || imgVersion === 'v2' || imgId === 'avatar') {

        initials = getChar(data.firstName || data.user.firstName) + getChar(data.lastName || data.user.lastName);
        return <div class="initials">{initials}</div>;
        }



        // setup the dynamic url
        finalImagePath = this.createUrlAvatar(imgVersion, imgId, imgType, 'avatar_thumb_lg')
    }

    // final check, if user is anomnoms, only show default avatar
    if (data && data.payload && data.payload.isPublic === false) {
        if (initials) {
        return <div class="initials">{initials}</div>;
        } else {
        return <img src={'https://res.cloudinary.com/cotribute/image/upload/this_avatar_doesnt_exist.jpg'}></img>
        }
    }


    return <img src={finalImagePath}></img>
    }
    httpToHttps(logo) {
        return logo.replace(/^http:\/\//i, 'https://')
    }
    render() {

        const data = this.props.data;
        console.log("Response", data);
      
        let loadFromApplication = true;
        
        let isWhiteLabel = false,
            isAuthenticated = true;
        let menu = true;

        let user = {};
        user.firstName = "test1";
        user.lastName = "test2";
        user.imageId = "p/108207";
        user.imageVersion = "v1477338143";

        const communityMeta = data.communityData.meta;
        const brand = communityMeta.brand;
        // console.log("brand",brand);
        
        
        let permissions = data.permissionsData;
        console.log("permissions",permissions);
        const canApplyForEvent = permissions.canApplyForEvent;
        const canCreateEvent = permissions.canCreateEvent;
        
       
        return (
            <div className="platform-header">
                {  loadFromApplication &&
                <div id="headerSearch" className="constrain head_constrain">
                    
                    <div className="header-left">
                        <div className="brand" itemtype="http://schema.org/Organization">
                            <img className="logo" itemprop="logo" src={this.httpToHttps(brand.logo)} alt={brand.logoalt}></img>
                            <h3 itemprop="organizer" className="brand-name">{brand.logoalt}</h3>
                        </div>
                    </div>
                    <div className="header-right">
                        <label className="menu-toggle" for="menu-checkbox">
                            <span className="menu-toggle-icon"></span>
                            <span className="menu-toggle-label">Menu</span>
                        </label>
                        <ul className="menu menu-desktop">
                            {
                                canApplyForEvent &&
                                <li className="menu-item apply-now-cta">
                                    <a>Apply Now</a>
                                    {/* <div className="apply-tooltip">
                                <callout visible="canApplyForEvent && showTooltip && (!user || !isAuthenticated)" key="event.apply">
                                    <p>Submit your project application.</p>
                                </callout>
                            </div> */}

                                </li>
                            }
                            {
                                !isWhiteLabel && user && isAuthenticated && canCreateEvent &&
                                <li className="menu-item createevent" >
                                    <a className="createevent">
                                        LEADERBOARD
                                </a>
                                </li>
                            }
                            {
                                !isWhiteLabel && user && isAuthenticated && canCreateEvent &&
                                <li className="menu-item createevent">
                                    <a className="createevent">
                                        Create {communityMeta && communityMeta.marketing && communityMeta.marketing.keywordUpper || 'Event'}
                                    </a>
                                </li>
                            }
                            {
                                menu &&
                                <li className="menu-item menu-desktop-toggle " ng-mouseenter="mouseEnter()" ng-mouseleave="mouseLeave()">
                                    <a href="">
                                        <div className="icon-menu">
                                            <Ionicon icon="ios-menu" fontSize="24px" />
                                        </div>


                                        Menu
                                </a>
                                </li>

                            }
                            {
                                user && isAuthenticated &&
                                <li className="menu-item">
                                    <div className="avatar avatar-sm" >
                                    { this.checkDataAvatar(user) }
                                    </div>

                                    {/* <i className="icon ion-arrow-down-b"></i>           */}
                                </li>
                            }


                        </ul>

                    </div>

                </div>
                }
            </div>
        )
    }
}

export default Header;