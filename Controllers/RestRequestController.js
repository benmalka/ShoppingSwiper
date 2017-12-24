import server_data from '../Data/ServerData';



var post_request = (path, body) => {
    console.log(`Sending post request to '${path}'`)
    let _timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, {message: `request for '${path}' timed out`});
    })
    let _fetch = fetch(server_data.rest_server + path,
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            })
    return Promise.race([_timeout, _fetch])
}

var facebook_post_request = (userID, fb_token, fb_params) =>{
  console.log(`Sending post request to facebook`)
  let fields = fb_params.join()
  let _timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 5000, {message: `request for facebook timed out`});
  })
  let _fetch = fetch(`${server_data.facebook_api}/${userID}?fields=${fields}&access_token=${fb_token}&redirect=false`)
  return Promise.race([_timeout, _fetch])
}

export {post_request, facebook_post_request}