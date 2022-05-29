<?php

namespace App\Models\System;

class System {    

    const DATA_BRIEF = 0;
    const DATA_LIST = 1;
    const DATA_DETAILS = 2;

    const HTTP_OK = 200;
    const HTTP_UNAUTHORIZED = 401;
    const HTTP_BAD_REQUEST = 400;
    const HTTP_SEE_OTHER = 303;
    const HTTP_SERVER_ERROR = 500;
    const HTTP_EXPIRED = 419;

    public static function isHttpError($code) {

        return $code < 1000;
    }    

    const ERROR_NONE = 0;
    const ERROR_ITEM_ALREADY_EXISTS = 1001;
    const ERROR_INVALID_INPUT = 1002;
    const ERROR_OPERATION_NOT_ALLOWED = 1003;
    const ERROR_INSUFFICIENT_PRIVILEGES = 1004;
    const ERROR_ITEM_NOT_EMPTY = 1005;
    const ERROR_INVALID_REQUEST = 1006;
    const ERROR_ITEM_NOT_FOUND = 1007;
    const ERROR_OPERATION_FAILED = 1008;
    const ERROR_SEND_EMAIL_FAILED = 1009;
    const ERROR_FIELD_VALIDATION = 1010;

    const ERROR_INVALID_USER = 1100;
    const ERROR_EMAIL_ALREADY_EXISTS = 1101;
    const ERROR_MOBILE_ALREADY_EXISTS = 1102;
    const ERROR_MISSING_EMAIL_MOBILE = 1103;
    const ERROR_WRONG_OLD_PASSWORD = 1104;
    const ERROR_FORMAT_NOT_SUPPORTED = 1105;
    const ERROR_RESOURCE_EXPIRED = 1106;    
}
