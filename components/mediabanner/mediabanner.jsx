import React from 'react';
import './_media_banner.scss'
class MediaBanner extends React.Component {

    render() {
        const bannerData  = this.props.data;
        return (
            <div className="media-banner">
            <div className="row">
                <div className="media-wrap">
                    {bannerData.image && !bannerData.video &&

                        <a href={bannerData.ctaAction}>
                            <img className="image" src={bannerData.image} />
                        </a>
                    }
                    {bannerData.video &&
                        <iframe className="video" width="100%" height="100%" src={bannerData.video} frameborder="0" allowfullscreen></iframe>
                    }
                </div>
                <div className="media-copy" className={bannerData.alert ? 'align-left' : ''}>
                    {bannerData.alert &&
                        <h3>
                            <i className="icon ion-android-close"></i> {bannerData.alert}
                        </h3>
                    }
                    <h2>{bannerData.title}</h2>
                    {bannerData.description &&
                        <p>{bannerData.description}</p>
                    }
                    {bannerData.ctaAction &&
                        <a href={bannerData.ctaAction} target="_self" className="btn btn-secondary btn-outlined">{bannerData.ctaTitle}</a>
                    }
                </div>
            </div>
            </div>
        );
    }
}

export default MediaBanner;