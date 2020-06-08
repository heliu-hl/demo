// //返回内容：     [subscribe] => 1 [openid] => oZE7SjqjC_A88aGfaj_X8tJDC  [nickname] => 大仙 [sex] => 1 [language] => zh_CN [city] => 大兴 [province] => 北京 [country] => 中国 [headimgurl]
// function getUserInfoAll ($code) {
//     $appid = WX_APP_ID
//     $secret = WX_SECRET
//     //第一步:取全局access_token $token =  $global_token;
//     //第二步:取得openid
//     $oauth2Url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$secret&code=$code&grant_type=authorization_code"
//     $oauth2 = getJson($oauth2Url)
//
//     //第三步:根据全局access_token和openid查询用户信息    $access_token = $token;
//     $openid = $oauth2['openid']
//     $get_user_info_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$access_token&openid=$openid&lang=zh_CN"//有subscribe
//     $userinfo = getJson($get_user_info_url)
//     session_start()
//     //     session_id($userinfo['openid']);
//     if ($userinfo['subscribe'] == 1) {
//         $_SESSION['userinfo'] = $userinfo
//     }
//     return $userinfo
// }
//
// //返回无subscribe
// function getUserInfo ($code) {
//     $appid = 'wx81827b701afb5a33'
//     $appsecret = 'e3aa34f3a19a950880732ec1d7d2d8e4'
//     $access_token = ""
//
//     //根据code获得Access Token
//     $access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$appsecret&code=$code&grant_type=authorization_code"
//     $access_token_json = https_request($access_token_url)
//     $access_token_array = json_decode($access_token_json, true)
//     $access_token = $access_token_array['access_token']
//     $openid = $access_token_array['openid']
//
//     //根据Access Token和OpenID获得用户信息
//     $userinfo_url = "https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$openid "//无subscribe
//     $userinfo = https_request($userinfo_url)
//     $userinfo = json_decode($userinfo, true)
//
//     return $userinfo
//
// }
