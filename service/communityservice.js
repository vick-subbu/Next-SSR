const axios = require('axios');

function getCommunityDetails(req) {
    console.log("https://staging.cotribute.co/api/communities/" + req.params.id)
    var requestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-Cotribute-Client-Id': '833e0c7c57a48466eb2ee94db8071d272353ba27e',
            'Accept': 'application/vnd.cotribute.v2+json',
            'Authorization': 'Token token=be9bc1505879bdcb9906b69b6d56fbce'
        }
    }
    return axios.get("https://staging.cotribute.co/api/communities/" + req.params.id, requestConfig);
}

function getCommunityPermissions(req) {
    console.log("https://staging.cotribute.co/api/" + req.params.id)
    var requestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'X-Cotribute-Client-Id': '833e0c7c57a48466eb2ee94db8071d272353ba27e',
            'Accept': 'application/vnd.cotribute.v2+json',
            'Authorization': 'Token token=be9bc1505879bdcb9906b69b6d56fbce'
        }
    }
    return axios.get("https://staging.cotribute.co/api/communities/" + req.params.id + "/permissions", requestConfig);

}

exports.getCommunity = function (req, res, callback) {
    axios.all([getCommunityDetails(req), getCommunityPermissions(req)]).then(axios.spread(function (communitydetails, communitypermissions) {
        callback (communitydetails, communitypermissions);

    }))
}

