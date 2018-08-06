import React from 'react';
import './_collection_header.scss';
import './_new.scss';
class CollectionHeader extends React.Component {
   render() {
     let data ={};
     data.stats ={};
    data.stats.title = "Co.tribute Community Boardz";
    data.stats.subtitle = "We are doing awesome things, check out all that we've done!";
    return (
      <div className="collection-header">
          
          <div class="row has-image collect_head_row">
            <div className="background background-image" >
            </div>
            <div className="header-main community_head has-image">
                <div class="stat-achieved">
                  <h2 class="stats_head">{data.stats.title}</h2>
                  <h4>{data.stats.subtitle}</h4>
                </div>  
            </div>
            <div class="share-container has-image share-container_collection">
                <p class="tagline">Share and inspire others</p>
                <div class="share">
                  {/* <social-share data="socialData" area="Collection"></social-share> */}
                </div>
            </div>
          </div>
     </div>

    )
     
    }

}

export default CollectionHeader;