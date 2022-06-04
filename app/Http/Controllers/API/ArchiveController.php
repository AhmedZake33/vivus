<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Archive\Archive;


class ArchiveController extends Controller
{
    public function secureDownload($sid){

        $list = explode(",", $sid);
        $id = $list[0];
        $archive = Archive::where('id', $id)->first();

        if ($archive->isFolder()) {
            return error(System::ERROR_INVALID_REQUEST, 500);
        }

        try {
            return $archive->download();

        } catch (\Throwable $e) {
            return error(System::ERROR_OPERATION_FAILED, 500);
        }
    }
}
