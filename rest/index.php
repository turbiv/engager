<?php
// server PHP 5.4.45 
require_once './vendors/lib/limonade.php';
require_once './vendors/google-api/vendor/autoload.php';



$sql_servername = "localhost";
$sql_username = "engager";
$sql_password = "pasha1";
$sql_database = "engager";

define("PUBLISH_DRAFT", 1);
define("PUBLISH_STAGING", 2);
define("PUBLISH_PRODUCTION", 3);

define("ORDER_STARTED", 1);
define("ORDER_DONE", 2);


define("HTTP_BadRequest", 400);
define("HTTP_Unauthorized", 401);
define("HTTP_NotFound", 404);
define("HTTP_TooManyRequests", 429);


define("HTTP_InternalServerError", 500);

function configure()
{
  //option('env', ENV_DEVELOPMENT);
  option('env', ENV_PRODUCTION);
  option('signature', False); // no x-limonade signature
  option('debug', False);
  option(LIM_SESSION_NAME,false);
  option('session',false);
  
  
}

function cors() {

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');


    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }
}

function get_client_ip() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

function guidv4()
{
    $data = random_bytes(16);
    assert(strlen($data) == 16);

    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function makeConnection()
{
    $mysqli = new mysqli($GLOBALS['sql_servername'], $GLOBALS['sql_username'], $GLOBALS['sql_password'], $GLOBALS['sql_database']);

    if ($mysqli->connect_error) {
        return Null;
    }
    return $mysqli;
}

function readImage($mysqli, $uuid, $type, &$ct, &$content)
{
    $sql = "SELECT content, content_type FROM image WHERE publishing_type=? AND uuid=?";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;

    $publishing_type = $type;
    $stmt->bind_param("is", $publishing_type, $uuid);
    $stmt->execute();

    $stmt->bind_result($content, $ct);
    if(!$stmt->fetch())
        return False;

    return True;
}


function saveImage($mysqli, $account_id, $uuid, $meta, $ct,$content)
{
    // https://websitebeaver.com/prepared-statements-in-php-mysqli-to-prevent-sql-injection
    $sql = "INSERT INTO image(account_id, publishing_type, uuid, meta, content_type, content) VALUES(?,?,?,?,?,?)";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;
        $null = NULL;
        $publishing_type = PUBLISH_DRAFT;

        if(!$stmt->bind_param("iisssb", $account_id, $publishing_type, $uuid, $meta, $ct, $null))
            return False;
        if(!$stmt->send_long_data(5, $content))
            return False;
        if(!$stmt->execute())
            return False;
        if($mysqli->errno != 0)
            return False;
    } catch(Exception $e) {
        return False;
    }
    
    return True;
}

function makeOrder($mysqli, $account_id, $publishing_type, $order_status, $sender_ip, $user_code, $key_uuid, $valid_priod, $json)
{
    $sql = "INSERT INTO customer_order(json, account_id, publishing_type, order_status, key_uuid, sender_ip, ".
                "create_time, user_code, client_valid_to_time) VALUES(?,?,?, ?,?,?, ?,?,?)";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;

        $null = NULL;
        $create_time = time();
        if(!$stmt->bind_param("biiissisi", $null, $account_id, $publishing_type, $order_status,
        $key_uuid,$sender_ip,$create_time,$user_code,$valid_priod
        ))
            return False;
        if(!$stmt->send_long_data(0, $json))
            return False;
            
        if(!$stmt->execute() || $mysqli->errno != 0)
            return False;
    } catch(Exception $e) {
        return False;
    }
    
    return True;
}

function candelOrder($mysqli, $key_uuid)
{
    $sql = "DELETE FROM customer_order WHERE key_uuid=?";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;
        if(!$stmt->bind_param("s", $key_uuid))
            return False;
        if(!$stmt->execute() || $mysqli->errno != 0)
            return False;
    } catch(Exception $e) {
        return False;
    }
    
    return True;
}

function completeOrder($mysqli, $account_id, $key_uuid)
{
    $sql = "UPDATE customer_order SET order_status=? WHERE account_id=? AND key_uuid=?";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;
        $completed = ORDER_DONE;
        if(!$stmt->bind_param("iis", $completed, $account_id, $key_uuid))
            return False;
        if(!$stmt->execute() || $mysqli->errno != 0)
            return False;
    } catch(Exception $e) {
        return False;
    }
    
    return True;
}

function countStartedOrders($mysqli,  $account_id, $sender_ip, &$count )
{
    $sql = "SELECT count(*) as count FROM customer_order WHERE account_id=? AND sender_ip=? AND create_time>?";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;

    $mintm = time();
    $mintm = $mintm - 24*60*60;
    
    $stmt->bind_param("isi", $account_id, $sender_ip, $mintm);
    $stmt->execute();

    $stmt->bind_result($count);
    if(!$stmt->fetch())
        return False;

    return True;
}

function countUserCodes($mysqli, $account_id, $user_code, $publishing_type, &$count )
{
    $sql = "SELECT count(*) as count FROM customer_order WHERE account_id=? AND user_code=? AND publishing_type=?";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
    
    $stmt->bind_param("isi", $account_id, $user_code, $publishing_type);
    $stmt->execute();

    $stmt->bind_result($count);
    if(!$stmt->fetch())
        return False;

    return True;
}


function createUserCodeForOrder($mysqli, $account_id, $publishing_type, &$user_code )
{
    $tried = 0;
    do
    {
        $user_code = ''.rand(1000, 9999);
        
        $count = 0;
        $status = countUserCodes($mysqli, $account_id, $user_code, $publishing_type, $count);
        
        if(!$status)
            halt(HTTP_InternalServerError, "failed DB ".$mysqli->errno);
        if($count == 0)
            return True;


        $tried ++;
        
    }while($tried < 100);

    return False;
}

// QR
// https://developers.google.com/chart/infographics/docs/qr_codes?csw=1

function validateToken($token, &$email, &$why)
{
    try{
        $CLIENT_ID='922637484566-v5444u8s19lvt81d1vu07kgt3njtemo5.apps.googleusercontent.com';
        $client = new Google_Client(['client_id' => $CLIENT_ID]);  
        $payload = $client->verifyIdToken($token);
        if ($payload) {
          $userid = $payload['sub'];
          $email = $payload['email'];
          //var_dump($payload);
          if(empty(email)){
            $why = "bad response from Google";
            return False;
          }
          
          return True;
        } else {
          $why   = "invalid token";
        }
    } 
    catch(Exception $e) {
          $why = "exception in Google_Client ".$e->getMessage();
    }
    return False;
}

function fetchAccountId($mysqli, $sql, $param, &$account_id)
{
    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
    $stmt->bind_param("s", $param);
    $stmt->execute();
    
    $stmt->bind_result($account_id);
    if(!$stmt->fetch())
        return False;

    return True;
}

function findAccountForEmail($mysqli, $email, &$account_id)
{
    $sql = "SELECT account_id FROM registration WHERE email = ?";

    return fetchAccountId($mysqli, $sql, strtolower($email), $account_id);
}

function findAccountForKey($mysqli, $key, &$account_id)
{
    $sql = "SELECT account_id FROM account WHERE account_key = ?";
    return fetchAccountId($mysqli, $sql, $key, $account_id);
}


function getDraftProfile($mysqli, $account_id, $type, &$draft_json)
{
    $draft_json = "";
    $sql = "SELECT json FROM profile WHERE account_id = ? AND publishing_type=?";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
    $publishing_type = $type;
    $stmt->bind_param("ii", $account_id, $publishing_type);
    $stmt->execute();
    
    $stmt->bind_result($draft_json);
    if(!$stmt->fetch())
        return False;

    return True;
}

function getPublishedProfile($mysqli, $account_key, $type, &$json)
{
    $json = "";
    $sql = "SELECT json FROM profile p, account a WHERE a.account_id = p.account_id AND ".
    "p.publishing_type=? AND a.account_key=?";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
    $publishing_type = $type;
    $stmt->bind_param("is", $publishing_type, $account_key);
    $stmt->execute();
    
    $stmt->bind_result($json);
    if(!$stmt->fetch())
        return False;

    return True;
}



function saveDraftProfile($mysqli, $account_id, $draft_json)
{
    $sql = "INSERT INTO profile(account_id, publishing_type, json) VALUES(?,?,?) ON DUPLICATE KEY UPDATE json = ?";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;

        $null = NULL;
        $publishing_type = PUBLISH_DRAFT;
        if(!$stmt->bind_param("iibb", $account_id, $publishing_type, $null, $null))
        {
            return False;
        }
        if(!$stmt->send_long_data(2, $draft_json))
            return False;

        if(!$stmt->send_long_data(3, $draft_json))
            return False;

        if(!$stmt->execute())
            return False;

        return $mysqli->errno == 0;

    } catch(Exception $e) {
        return False;
    }
    
    return True;
}



function removeOldPromocodes($mysqli, $account_id, $publishing_type)
{
    $sql = "DELETE FROM promocode WHERE account_id=? AND publishing_type=?";
    
    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
            
    if(!$stmt->bind_param("ii", $account_id, $publishing_type))
        return False;
          
    if(!$stmt->execute())
        return False;
    return $mysqli->errno == 0;
}   

function removeOldImages($mysqli, $account_id, $publishing_type)
{
    $sql = "DELETE FROM image WHERE account_id=? AND publishing_type=?";
    
    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
            
    if(!$stmt->bind_param("ii", $account_id, $publishing_type))
        return False;
          
    if(!$stmt->execute())
        return False;
    return $mysqli->errno == 0;
}   

function removeOldProfile($mysqli, $account_id, $publishing_type)
{
    $sql = "DELETE FROM profile WHERE account_id=? AND publishing_type=?";
    
    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
            
    if(!$stmt->bind_param("ii", $account_id, $publishing_type))
        return False;
          
    if(!$stmt->execute())
        return False;
    return $mysqli->errno == 0;
}   

function publishImagesToProfile($mysqli, $account_id, $fromType, $toType)
{
    $sql = "INSERT INTO image(account_id, publishing_type, uuid, meta, content_type, content)".
    "SELECT account_id, ?, uuid, meta, content_type, content FROM image as src WHERE ".
    "src.account_id=? AND src.publishing_type=?";
    
    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;

    $null = NULL;
    $publishing_type = PUBLISH_DRAFT;
    if(!$stmt->bind_param("iii", $toType, $account_id, $publishing_type))
    {
        return False;
    }

    if(!$stmt->execute())
        return False;

    return $mysqli->errno == 0;
}

function publishPromocodeToProfile($mysqli, $account_id, $fromType, $toType)
{
    $sql = "INSERT INTO promocode(account_id, publishing_type, user_code, json) ".
    "SELECT account_id, ?, user_code, json FROM promocode as src WHERE ".
    "src.account_id=? AND src.publishing_type=?";
    
    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;

    $null = NULL;
    $publishing_type = PUBLISH_DRAFT;
    if(!$stmt->bind_param("iii", $toType, $account_id, $publishing_type))
    {
        return False;
    }

    if(!$stmt->execute())
        return False;

    return $mysqli->errno == 0;
}


function publishProfileToAccount($mysqli, $account_id, $fromType, $toType)
{
    $sql = "INSERT INTO profile(account_id, publishing_type, json) ".
    "SELECT account_id, ?, json FROM profile as src WHERE ".
    "src.account_id=? AND src.publishing_type=?";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;

    $null = NULL;
    $publishing_type = PUBLISH_DRAFT;
    if(!$stmt->bind_param("iii", $toType, $account_id, $publishing_type))
    {
        return False;
    }

    if(!$stmt->execute())
        return False;

    return $mysqli->errno == 0;
}

function getMyOrders($mysqli, $account_id, $publishing_type, &$orders)
{
    
    $sql = "SELECT create_time,client_valid_to_time,user_code,key_uuid,order_status,json FROM customer_order ".
    "WHERE account_id = ? AND publishing_type=? AND (create_time+client_valid_to_time) > ? ".
    "ORDER BY create_time DESC ";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
    $tm = time();
    $stmt->bind_param("iii", $account_id, $publishing_type,$tm);
    $stmt->execute();
    
    
    $stmt->bind_result($create_time,$client_valid_to_time,$user_code,$key_uuid,$order_status,$json);
    
    $orders = array();

    while($stmt->fetch())
    {
        $order = (object) array('create_time' => $create_time, 
                                 'client_valid_to_time' =>  $client_valid_to_time,
                                 'user_code' =>  $user_code,
                                 'key_uuid' =>  $key_uuid,
                                 'order_status' =>  $order_status,
                                 'json' =>  $json                                 
                                 );
        
        array_push($orders, $order);
    }
    return True;
    
}

function getMyPromocodes($mysqli, $account_id, $publishing_type, &$promocodes)
{
    $sql = "SELECT promocode_id,user_code,json FROM promocode ".
    " WHERE account_id = ? AND publishing_type=? ";


    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
    $tm = time();
    $stmt->bind_param("ii", $account_id, $publishing_type);
    $stmt->execute();
    
    
    $stmt->bind_result($promocode_id, $user_code, $json);
    
    $promocodes = array();

    while($stmt->fetch())
    {
        $promocode = (object) array('promocode_id' => $promocode_id, 
                                 'user_code' =>  $user_code,
                                 'json' =>  $json                                 
                                 );
        
        array_push($promocodes, $promocode);
    }
    return True;
}

function addMyPromocode($mysqli, $account_id, $publishing_type, $user_code, $json)
{
    $sql = "INSERT INTO promocode(account_id, publishing_type, user_code, json)".
                "VALUES(?,?,?,?)";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;

        $null = NULL;
        if(!$stmt->bind_param("iisb", $account_id, $publishing_type, $user_code, $null))
            return False;

        if(!$stmt->send_long_data(3, $json))
            return False;
            
        if(!$stmt->execute() || $mysqli->errno != 0)
            return False;
    } catch(Exception $e) {
        return False;
    }
    
    return True;
}

function updateMyPromocode($mysqli, $promocode_id, $user_code, $json)
{
    $sql = "UPDATE promocode SET user_code=?, json=? WHERE promocode_id=?";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;

        $null = NULL;
        if(!$stmt->bind_param("sbi", $user_code, $null, $promocode_id))
            return False;

        if(!$stmt->send_long_data(1, $json))
            return False;
            
        if(!$stmt->execute() || $mysqli->errno != 0)
            return False;
    } catch(Exception $e) {
        return False;
    }
    
    return True;
}

function deletePromocode($mysqli, $promocode_id)
{
    $sql = "DELETE FROM promocode WHERE promocode_id=?";
    $mysqli->autocommit(TRUE); 
 
    try{
        $stmt = $mysqli->prepare($sql);
        if(!$stmt)
            return False;

        if(!$stmt->bind_param("i", $promocode_id))
            return False;
            
        if(!$stmt->execute() || $mysqli->errno != 0)
            return False;
    } catch(Exception $e) {
        return False;
    }
    
    return True;
}

function checkMyPromocode($mysqli, $account_id, $publishing_type, $code, &$json)
{
    $json = "";
    $sql = "SELECT json FROM promocode WHERE account_id = ? AND publishing_type=? AND user_code=?";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;

    $stmt->bind_param("iis", $account_id, $publishing_type, $code);
    $stmt->execute();
    
    $stmt->bind_result($json);
    if(!$stmt->fetch())
        return False;

    return True;
}

function publishProfile($mysqli, $account_id, $publishing_type)
{
    $mysqli->autocommit(FALSE); 

    $fromType=0;
     $toType=0;
    if($publishing_type==PUBLISH_STAGING)
    {
        $fromType=PUBLISH_DRAFT;
        $toType=PUBLISH_STAGING;
    }

    if(!removeOldPromocodes($mysqli, $account_id, $publishing_type))
        return False;
    if(!removeOldImages($mysqli, $account_id, $publishing_type))
        return False;
    if(!removeOldProfile($mysqli, $account_id, $publishing_type))
        return False;


    !$status = publishPromocodeToProfile($mysqli, $account_id, $fromType, $toType);
    if(!$status)
        return False;

    $status = publishImagesToProfile($mysqli, $account_id, $fromType, $toType);
    if(!$status)
        return False;
    $status =  publishProfileToAccount($mysqli, $account_id, $fromType, $toType);
    if(!$status)
        return False;

    $mysqli->commit();

    return True;
}

 function refValues($arr){
    $refs = array();
    foreach($arr as $key => $value)
        $refs[$key] = &$arr[$key];
    return $refs;
}

function deleteImages($mysqli, $uuids)
{
    $mysqli->autocommit(TRUE); 

    $qMarks = str_repeat('?,', count($uuids) - 1) . '?';
    $types = 'i'.str_repeat('s', count($uuids));
    $sql = "DELETE FROM image WHERE publishing_type=? AND uuid in ($qMarks)";

    $stmt = $mysqli->prepare($sql);
    if(!$stmt)
        return False;
        
    $publishing_type = PUBLISH_DRAFT;
    $input = array_merge(array($types, $publishing_type), $uuids);
    call_user_func_array(array($stmt, 'bind_param'), refValues($input));
      
            
    if(!$stmt->execute())
        return False;
    if($mysqli->errno != 0)
        return False;

    return True;
}



function getAccountFromToken($token, &$mysqli)
{
    $email = "";
    $why = "";
    $status = validateToken($token, $email, $why);
    if(!$status)
    {
        halt(HTTP_Unauthorized, "authorization not passed: ".$why);
    }
    
    $mysqli = makeConnection();
    if(!$mysqli)
    {
        halt(HTTP_InternalServerError, "can't connect to DB");
    }

    $account_id=0;
    $status = findAccountForEmail($mysqli, $email, $account_id);

    if(!$status)
    {
        halt(HTTP_Unauthorized, "account is not registered ".$email);
    }
    return $account_id;
}

function getAccountFromKey($key, &$mysqli)
{
    $mysqli = makeConnection();
    if(!$mysqli)
    {
        halt(HTTP_InternalServerError, "can't connect to DB");
    }

    $account_id=0;
    $status = findAccountForKey($mysqli, $key, $account_id);

    if(!$status)
    {
        halt(HTTP_Unauthorized, "account is not registered ".$key);
    }
    return $account_id;
}



dispatch_get('/profile/:key/:type', 'get_profile');
  function get_profile()
  {
    $account_key = params('key');  
    $type = params('type');  
    if(empty($account_key) ||empty($type))
    {
        halt(HTTP_BadRequest, "account/type missed");
    }
    if(!($type == PUBLISH_STAGING || $type == PUBLISH_PRODUCTION))
    {
        halt(HTTP_BadRequest, "bad publishing");
    }
    $mysqli = makeConnection();
    if(!$mysqli)
    {
        halt(HTTP_InternalServerError, "can't connect");
    }
        
    $status =  getPublishedProfile($mysqli, $account_key, $type, $json);

    if(!$status)
        return "";
        
    $expire=0;
    if($type == PUBLISH_STAGING)
        $expire=1; 
    else
        $expire=15; 
    $expire *= 60; // seconds
    
    header("cache-control: max-age={$expire}, public, immutable");
    return $json;
  }
  



dispatch_get('/image/:type/:uuid', 'get_image');
  function get_image()
  {
    $uuid = params('uuid');  
    if(empty($uuid))
    {
        halt(HTTP_BadRequest, "uuid missed");
    }

    $type = params('type');  
    if(empty($type))
    {
        halt(HTTP_BadRequest, "type is missed");
    }


    $mysqli = makeConnection();
    if(!$mysqli)
    {
        halt(HTTP_InternalServerError, "can't connect");
    }
        
    $ct="";
    $content = "";
    if(!readImage($mysqli, $uuid, $type, $ct, $content))
    {
        halt(HTTP_NotFound, "image not found");
    }
    
    header("Content-Type: ".$ct);
    header("Content-Length: ".strlen($content));
    header("cache-control: max-age=315360000, public, immutable");
    echo($content);
    return "";
  }
  


dispatch_post('/image/:meta/:uuid', 'save_image');
  function save_image()
  {

    $uuid = params('uuid');  
    $meta = params('meta');  
    $token = getallheaders()['Authorization'];  
    if(empty($uuid) || empty($meta) || empty($token))
    {
        halt(HTTP_BadRequest, "uuid/meta/token missed");
    }
    
    if(empty($_FILES['image']))
    {
        halt(HTTP_BadRequest, "No image");
    }

    $content = file_get_contents($_FILES['image']["tmp_name"]);
    if(!$content)
    {
        halt(HTTP_InternalServerError, "unable to read input file");
    }
    $ct = $_FILES['image']["type"];

    $account_id = getAccountFromToken($token, $mysqli);

    if(!saveImage($mysqli, $account_id, $uuid, $meta, $ct, $content))
    {
        halt(HTTP_InternalServerError, "can't save");
    }

    return "";
  }

dispatch_delete('/image', 'remove_images');
  function remove_images()
  {
    $payload_json = file_get_contents('php://input');
    $payload = json_decode($payload_json);

    if(!$payload || gettype($payload) != "object")
    {
        halt(400, "bad input");
    }
    
    $token =  isset($payload->{'token'}) ? $payload->{'token'} : null;
    $uuids =  isset($payload->{'uuids'}) ? $payload->{'uuids'} : null;
    
    if(empty($token))
    {
        halt(HTTP_BadRequest, "token missed");
    }
    
    if(!is_array($uuids))
    {
        halt(HTTP_BadRequest, "no UUIDs passed");
    }
    if(empty($uuids))
        return "";
    
    $account_id = getAccountFromToken($token, $mysqli);
    if(!deleteImages($mysqli, $uuids))
    {
        halt(HTTP_InternalServerError, "failed to delete");
    }
    

    return "";
  }  
  
  
  
dispatch_get('/my-profile', 'get_my_profile');
  function get_my_profile()
  {
    $token = getallheaders()['Authorization'];  
    
    if(empty($token))
    {
        halt(HTTP_BadRequest, "authorization token is missed");
    }

    $account_id = getAccountFromToken($token, $mysqli);
    
    $status =  getDraftProfile($mysqli, $account_id, PUBLISH_DRAFT, $draft_json);
    if($status)
        return $draft_json;
  }

dispatch_post('/my-profile', 'post_my_profile');
  function post_my_profile()
  {
    $token = getallheaders()['Authorization'];  
    if(empty($token))
    {
        halt(HTTP_BadRequest, "authorization token is missed");
    }
    
    $draft_json = file_get_contents('php://input');

    $account_id = getAccountFromToken($token, $mysqli);

    $status =  saveDraftProfile($mysqli, $account_id, $draft_json);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed to save into DB ".$mysqli->errno);
    }

    return "";
  }

dispatch_post('/publish/:type', 'publish_my_profile');
  function publish_my_profile()
  {
    $token = getallheaders()['Authorization'];  
    if(empty($token))
    {
        halt(HTTP_Unauthorized, "authorization token is missed");
    }

    $type = params('type');  
    if(empty($type))
    {
        halt(HTTP_BadRequest, "type is missed");
    }
    if(!($type == PUBLISH_STAGING || $type == PUBLISH_PRODUCTION))
    {
        halt(HTTP_BadRequest, "type is unsupported");
    }

    $account_id = getAccountFromToken($token, $mysqli);

    $status =  publishProfile($mysqli, $account_id, $type);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed to save into DB ".$mysqli->errno);
    }

    return "";
  }

dispatch_post('/start_order/:publishing_type/:account_key/:valid_priod', 'start_order');
  function start_order()
  {      
    $publishing_type = params('publishing_type');  
    $account_key = params('account_key');  
    $valid_priod = params('valid_priod'); 

    if(empty($account_key) 
    || empty($publishing_type) 
    || empty($valid_priod) 
    )
    {
        halt(HTTP_BadRequest, "type/account/valid missed");
    }
    $json = file_get_contents('php://input');
    if(empty($json))
    {
        halt(HTTP_BadRequest, "data missed");
    }

    $account_id = getAccountFromKey($account_key, $mysqli);

    $sender_ip = get_client_ip();
    $key_uuid = guidv4();
    $user_code = "";
    
    
    $count = 0;
    $status = countStartedOrders($mysqli, $account_id, $sender_ip, $count);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed to count ".$mysqli->errno);
    }
    
    if($count > 2000)
    {
        halt(HTTP_TooManyRequests, "");
    }
    
    $status = createUserCodeForOrder($mysqli, $account_id, $publishing_type, $user_code);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "can't find code");
    }
    
    $order_status = ORDER_STARTED;
    $status = makeOrder($mysqli, $account_id, $publishing_type, $order_status, $sender_ip, $user_code, $key_uuid, $valid_priod, $json);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed to save into DB ".$mysqli->errno);
    }
    
    $result = (object) array('user_code' => $user_code, 'uuid' =>  $key_uuid);


    return json_encode($result);

  }

dispatch_delete('/cancel_order/:key', 'cancel_order');
  function cancel_order()
  {      
    $uuid_key = params('key');  

    if(empty($uuid_key))
    {
        halt(HTTP_BadRequest, "key missed");
    }

    $mysqli = makeConnection();
    if(!$mysqli)
    {
        halt(HTTP_InternalServerError, "can't connect");
    }

    $status = candelOrder($mysqli, $uuid_key);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed to save into DB ".$mysqli->errno);
    }


    return "";
  }

dispatch_get('/orders/:type', 'get_my_orders');
  function get_my_orders()
  {      
    $type  = params('type');  

    if(empty($type))
    {
        halt(HTTP_BadRequest, "type missed");
    }

    $token = getallheaders()['Authorization'];  
    if(empty($token))
    {
        halt(HTTP_Unauthorized, "authorization token is missed");
    }

    if(!($type == PUBLISH_STAGING || $type == PUBLISH_PRODUCTION))
    {
        halt(HTTP_BadRequest, "type is unsupported");
    }

    $account_id = getAccountFromToken($token, $mysqli);

    $status =  getDraftProfile($mysqli, $account_id, $type, $draft_json);
    if(!$status || strlen($draft_json) ==0 )
    {
        halt(HTTP_BadRequest, "profile was not found");
    }

    
    $status =  getMyOrders($mysqli, $account_id, $type, $orders);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed to read from DB ".$mysqli->errno);
    }

    $result = (object) array('orders' => $orders, 'profile' =>  $draft_json, 'timenow'=> time());


    return json_encode($result);
  }

dispatch_post('/order_complete/:key', 'order_complete');
  function order_complete()
  {      
    $uuid_key = params('key');  

    if(empty($uuid_key))
    {
        halt(HTTP_BadRequest, "key missed");
    }


    $token = getallheaders()['Authorization'];  
    if(empty($token))
    {
        halt(HTTP_Unauthorized, "authorization token is missed");
    }


    $account_id = getAccountFromToken($token, $mysqli);
    
    $status =  completeOrder($mysqli, $account_id, $uuid_key);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed with DB ".$mysqli->errno);
    }


    return "";
  }

dispatch_get('/promocodes', 'get_my_promocodes');
  function get_my_promocodes()
  {      
    $token = getallheaders()['Authorization'];  
    if(empty($token))
    {
        halt(HTTP_Unauthorized, "authorization token is missed");
    }

    $account_id = getAccountFromToken($token, $mysqli);
    $type  = PUBLISH_DRAFT;  
    
    $status =  getMyPromocodes($mysqli, $account_id, $type, $promocodes);
    if(!$status)
    {
        halt(HTTP_InternalServerError, "failed to read promocodes ".$mysqli->errno);
    }

    $result = (object) array('promocodes' => $promocodes);

    return json_encode($result);
  }

dispatch_post('/promocode/:id/:user_code', 'post_my_promocode');
  function post_my_promocode()
  {      
    $user_code = params('user_code');

    $id = params('id');
    $token = getallheaders()['Authorization'];  
    if(empty($token))
    {
        halt(HTTP_Unauthorized, "authorization token is missed");
    }

    $account_id = getAccountFromToken($token, $mysqli);
    $json = file_get_contents('php://input');
    $type  = PUBLISH_DRAFT;  

    if(empty($user_code))
        $user_code = "";
    
    if(intval($id) == 0)
    {
        $status = addMyPromocode($mysqli, $account_id, $type, $user_code, $json);
        if(!$status)
        {
            halt(HTTP_InternalServerError, "failed to create promocode ".$mysqli->errno);
        }
    }
    else
    {
        $status = updateMyPromocode($mysqli, $id, $user_code, $json);
        if(!$status)
        {
            halt(HTTP_InternalServerError, "failed to update promocode ".$mysqli->errno);
        }

    }
    return "";
  }

dispatch_delete('/promocode/:id', 'remove_promocode');
  function remove_promocode()
  {
    $id = params('id');

    $payload_json = file_get_contents('php://input');
    $payload = json_decode($payload_json);

    if(!$payload || gettype($payload) != "object")
    {
        halt(400, "bad input");
    }
    
    $token =  isset($payload->{'token'}) ? $payload->{'token'} : null;
    
    if(empty($token))
    {
        halt(HTTP_BadRequest, "token missed");
    }


    $account_id = getAccountFromToken($token, $mysqli);

    if(!deletePromocode($mysqli, $id))
    {
        halt(HTTP_InternalServerError, "failed to delete");
    }


    return "";
  }  
  

dispatch_get('/promocode_validate/:account_key/:publishing_type/:code', 'promocode_validate');
  function promocode_validate()
  {      
    $publishing_type = params('publishing_type');  
    $account_key = params('account_key');  
    $code = params('code'); 

    if(empty($account_key) 
    || empty($publishing_type) 
    || empty($code) 
    )
    {
        halt(HTTP_BadRequest, "type/account/code missed");
    }

    $account_id = getAccountFromKey($account_key, $mysqli);
    
    $status = checkMyPromocode($mysqli, $account_id, $publishing_type, $code, $json);
    if(!$status)
    {
        halt(HTTP_NotFound, "code not found ".$mysqli->errno);
    }
    
    return $json;
   }


cors();
run();

