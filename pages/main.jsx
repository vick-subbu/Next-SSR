
import './styles/_avatar.scss';
import './styles/widget-tems/_widget_items.scss';
import './styles/_widget.scss';
import './styles/_widgets_story_main.scss';
import './styles/_widgets_event_main.scss';
import './styles/_date_time.scss';
import './styles/_theme_image.scss';
import './styles/_location_snippet.scss';
import React from 'react'
import { Fragment } from 'react'
import Head from 'next/head'
import axios from 'axios';
import Header from './header/header.jsx';
import CollectionHeader from './collection-header/collection_header.jsx';
import Masonry from 'react-masonry-component'
import Footer from './footer/footer.jsx';
import MediaBanner from '../components/mediabanner/mediabanner'
import imageGenerator from './theme/ImageGenerator.js'


class community extends React.Component {
     
    constructor(props) {
        super(props);
        this.state = {
            items: []
          };
          this.nextFeedRequestId="";
        this.loadMore = this.loadMore.bind(this);
    }
    loadMore() {
        this.setState({
          visible: this.state.visible + 4
        });
      }
    static async getInitialProps({req, res}) {

        var requestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'X-Cotribute-Client-Id': '833e0c7c57a48466eb2ee94db8071d272353ba27e',
                'Accept': 'application/vnd.cotribute.v2+json',
                'Authorization': 'Token token=be9bc1505879bdcb9906b69b6d56fbce'
            }
        }
        const feedRes = await axios.get('https://staging.cotribute.co/api/communities/'+res.slugId+'/feed?startAt=Tue%20Jul%2031%202018%2014:50:47%20GMT+0530%20(India%20Standard%20Time)', requestConfig);
       

       
        // console.log('API Response', res.data.records);
        return { 
            data: feedRes.data, 
            communityDetails: res.communitydetails,
            slugId: res.slugId,
            communitypermissions: res.communitypermissions,
        }
    }
    async loadMore() {
        var requestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'X-Cotribute-Client-Id': '833e0c7c57a48466eb2ee94db8071d272353ba27e',
                'Accept': 'application/vnd.cotribute.v2+json',
                'Authorization': 'Token token=be9bc1505879bdcb9906b69b6d56fbce'
            }
        }
        if(this.nextFeedRequestId) {
            const res = await axios.get('https://staging.cotribute.co/api/communities/'+this.props.slugId+'/feed?'+this.nextFeedRequestId, requestConfig);
            this.nextFeedRequestId = res.data.next;
            this.setState({ 
                items: this.state.items.concat(res.data.records)
              })
        }
 
      
    }
    componentDidMount() {
        
        this.nextFeedRequestId = this.props.data.next;
        this.setState({items:this.props.data.records})
    }

    render() {

     
        const headerData ={};
        headerData.communityData = this.props.communityDetails;
        headerData.permissionsData = this.props.communitypermissions;
        return (

            <div>
             
                <Header data={headerData}></Header>
                <div class="main widget-items">
                    <div class="widgets eve_widget">
                    <CollectionHeader></CollectionHeader>

                        <Masonry>
                        {
                            this.state.items.map(data => {
                                if (data.type === 'story') {
                                    return (
                                        <div>
                                             <div class="card_margin">
                                                <StoryCard key={data.id} data={data}></StoryCard>
                                            </div>
                                        </div>
                                       
                                    )
                                } else if(data.type === 'event') {
                                    return (
                                        <div>
                                             <div class="card_margin">
                                                <EventCard key={data.id} data={data}></EventCard>
                                            </div>
                                        </div>
                                       
                                    )
                                }
                            }
                            )
                        }
                        </Masonry>
                    </div>
                </div>
                <div className="btn btn-pager loading"   onClick={this.loadMore}>LoadMore</div>
                <MediaBanner data = {this.props.communityDetails.meta.footerBanner}></MediaBanner>
                <Footer></Footer>
            </div>

        )
    }
}
class StoryCard extends React.Component {
    createUrl(version, id, transform, quality) {
        if (!version || !id) return ''
        transform = transform || 'widget_fullwidth'

        var file = (id.indexOf('.') > -1) ? '' : '.jpg'
        var qu = (quality) ? ',q_' + quality : ''

        version = version + '/'
        var url = 't_mb_' + transform + qu + '/' + version + id + file
        return "https://res.cloudinary.com/cotribute/image/upload/" + url.replace(/\/\//g, '\/')
    }
    createUrlAvatar(version, id, type, transform) {
        if (!version || !id) return ''
        transform = transform || 'avatar_thumb_lg'
    
        var file = (id.indexOf('.') > -1) ? '' : '.jpg'
        type = type || defaults.user
        version = (version || Config.CDN[type + 'DefaultVersion']) + '999/'
        id = id || Config.CDN[type + 'DefaultId']
        return  "https://res.cloudinary.com/cotribute/image/upload/" + 't_' + transform + ',d_default.jpg/' + version + id + file + ''.replace('\/\/', '/')
      }
    checkData(data) {
        let finalImagePath;

        if (data && data.images && data.images[0]) {
            finalImagePath = this.createUrl(data.images[0].imageVersion, data.images[0].imageId, undefined, 60)
        } else if (data && data.image) {
            finalImagePath = this.createUrl(data.imageVersion, data.image, undefined, 60)
        } else if (data && data.backgroundImage && data.backgroundImage.imageVersion) {
            finalImagePath = this.createUrl(data.backgroundImage.imageVersion, data.backgroundImage.image || data.backgroundImage.imageId, undefined, 60)
        } else if (data && data.poster && data.poster.imageVersions) {
            finalImagePath = this.createUrl(data.poster.imageVersions, data.poster.imageId, undefined, 60)
        } else if (data && data.imageId && data.imageVersion) {
            finalImagePath = this.createUrl(data.imageVersion, data.imageId, undefined, 60)
        }

        // apply path
        return finalImagePath;
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
    render() {

        const response = this.props.data;
        return (

            <div className="feed">

                <div className="widget widget-md widget-story">
                    {
                        response.announcement && 
                        <div className="widget-header widget-header-underlined">
                        <div className="row">
                            <div className="col col-100 widget-copy">
                                <p>{response.announcement}</p>
                            </div>
                        </div>
                    </div>
                    }
                    
                    <div className="widget-header">
                        <div className="row">
                            <div className="col col-20">
                                {/* <avatar data="data" size="sm" border="dark"></avatar> */}
                                <div className="avatar avatar-sm" title="data.firstName">

                                    
                                   { this.checkDataAvatar(response.user)}
                                   
                                </div>
                            </div>
                            <div className="col col-80">
                                <h4>{response.user.firstName} {response.user.lastName}</h4>
                                <time> <svg id="timeclock" x="0px" y="0px" viewBox="0 0 512 512" className="timestamp" >
                                    <path d="M256,48C141.1,48,48,141.1,48,256s93.1,208,208,208c114.9,0,208-93.1,208-208S370.9,48,256,48z M273,273H160v-17h96V128h17 V273z" />
                                </svg><small>9 days ago</small>
                                </time>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-100 widget-copy">
                                <p>{response.description}</p>
                                { 
                                    response.charity && response.minutes &&
                                    <span>
                                       {response.hours &&
                                            <a>{response.hours} Hour{response.hours > 1 ? 's ' : ' ' }</a> 
                                       } {
                                           response.minutes && response.mins != 0 &&
                                        <a>{response.mins} Minute{response.mins > 1 ? 's' : '' }</a>
                                       }
                                           
                                   
                                    </span>
                                }
                                <br />
                               { 
                               response.collection && response.collection.shareCtaCollection &&
                               <p className="sub-copy sub_copy">
                                    Posted to <span className="story_widget_ques">{response.collection.shareCtaCollection}</span>
                                </p>}
                                {
                                    response.event && response.event.name &&
                                    <span className="sub-copy">
                                        posted to <i><strong>{response.event.name}</strong></i>
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row widget-body">
                        <div className="picture picture-loadingg story-image" >
                            <img src={this.checkData(response)} />
                        </div>
                    </div>
                    <div className="footer row widget-footer">
                        <div className="story-like-only col col-50 widget-btns col col-50 widget-btns luvvit-parent story-like-only">
                            <div className="widget-btn-icon">
                                <div className="icon-container">
                                    <icon-luvvit>
                                        <svg className="luvvit-heart" x="0px" y="0px" viewBox="0 0 512 512" className="heart-icon" >
                                            <path d="M429.9,95.6c-40.4-42.1-106-42.1-146.4,0L256,124.1l-27.5-28.6c-40.5-42.1-106-42.1-146.4,0c-45.5,47.3-45.5,124.1,0,171.4 L256,448l173.9-181C475.4,219.7,475.4,142.9,429.9,95.6z" />
                                        </svg>
                                    </icon-luvvit>
                                    <div className="like-text">Like</div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>

            </div>
        );
    }
}

class EventCard extends React.Component { 
    render() {
 
     const data = this.props.data
     function checkData(data) {
 
         debugger;
         let property ={};
         if(!data.eventDetailsSaved && !data.newworkFlow) {
             
         }
         property.hideImage = false;
         property.maxImageWidth = 776;
 
         let imgSrc = "";
         let finalImagePath
         if (data && data.meta && data.meta.src) {
           // Fallback to pre-made theme image
           finalImagePath = data.meta.src
         } else if (data && data.meta && data.meta.theme) {
           finalImagePath = new imageGenerator().generateTheme(data, data.meta)
         } else if (data) {
           // Fallback to non-theme image
           finalImagePath = new imageGenerator().generateTheme(data)
         } else {
           // don't add image at allllllll, in fact, remove it!!
           imgSrc = ''
           return;
         }
 
       
         // apply path
         if (finalImagePath !== imgSrc && !property.hideImage) {
         //   elem.children().addClass('theme-image-loading')
           imgSrc = finalImagePath
         }
 
         if (typeof imgSrc === 'string') {
             let transformedImgSrc = imgSrc.replace('http://res.cloudinary', 'https://res.cloudinary')
             if (property.maxImageWidth > 0) {
                 transformedImgSrc = transformedImgSrc.replace(/\/image\/upload(\/t_[^\/]+)?\//, match => {
                 return `${match}/w_${property.maxImageWidth},f_auto,q_auto/`
               })
             }
 
             return transformedImgSrc
             
 
           }
 
           return "";
 
       }
       function getBodyContent(data) {
         let  isWhiteLabel = false;
         if (data.isRsvp && data.feed == false && data.members && data.members.length > 0)
         {
             return( 
            <div class="row widget-body event-short-body">
                 <div class="col col-25">
                 {/* <avatar data="data.members[data.members.length - 1]" border="dark"></avatar> */}
                 </div>
                 <div class="col col-75">
                 {/* ${attendingMembers} */}
                 </div>
           </div>)
         } else {
             return (    <div class="row widget-body" >
                 <div class="col col-100 widget-copy">
                     {/* <h4>{data.name | limitChars:140}</h4> */}
                     <h4>{data.name}</h4>
                     {data.host &&
                         <p class="host">Hosted by: {data.host}</p>
                     }
                     { isWhiteLabel && !data.host &&
                         <p  class="host">Hosted by: {data.creator.firstName} {data.creator.lastName}</p>
                     }
                     
                     
                  </div>
             </div>)
         }
      
       }
       function getLocation() {
 
         return (
             <div className="location-snippet">
             <svg version="1.1" id="location" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" enable-background="new 0 0 512 512" >
                 <path d="M256,32c-79.529,0-144,64.471-144,144c0,112,144,304,144,304s144-192,144-304C400,96.471,335.529,32,256,32z M256,222.9 c-25.9,0-46.9-21-46.9-46.9s21-46.9,46.9-46.9s46.9,21,46.9,46.9S281.9,222.9,256,222.9z"/>
             </svg>
             <div itemprop="location">{data.name}</div>
         </div>
         )   
      
       }
        return (
            <div className="feed">
                 <div className={ 'widget widget-md widget-event-main ' + ((data.images && data.images.length <= 0) ? 'widget-placeholder-state' : '') }>
                 {/* {(hasAnnouncement && canShowAnnouncement && data.announcement !== undefined) ? announcementHeader : ''}
                 {(isInvited) ? invitedHeader : ''} */}
                     <div class="row widget-body">
                         <div class="col col-100">
                             <div class="theme-image" >
                                 <img ng-hide="hideImage" src={checkData(data.images[0])}/>
                             </div>
                               
                         </div>
                     </div>
                     {getBodyContent(data)}
                     {getLocation(data)}
                 </div>
 
            </div>
        )
    }
 }

export default community;