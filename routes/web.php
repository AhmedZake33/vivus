<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

route::get('prepare',function(){
    DB::unprepared("
    CREATE TABLE archive (
      id int(11) NOT NULL,
      related_id int(11) NOT NULL DEFAULT 0,
      version int(11) NOT NULL DEFAULT 0,
      language char(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
      short_name varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      parent_id int(11) NOT NULL DEFAULT 0,
      type int(11) NOT NULL DEFAULT 0 COMMENT '0: folder, 1:page, 2:binary, 3:text, 4:json 5:xml, 6:url',
      archive_link varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      order int(11) DEFAULT NULL,
      flags int(11) NOT NULL DEFAULT 3,
      user_id int(11) DEFAULT NULL,
      title varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
      sub_title varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      description mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      extension varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      application_type varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      content_type varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      document_type_id int(11) DEFAULT NULL,
      document_id int(11) DEFAULT NULL,
      uploading_stage int(11) DEFAULT NULL,
      size int(11) NOT NULL DEFAULT 0,
      path varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      search_text text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      access_count int(11) NOT NULL DEFAULT 0,
      created_at timestamp NULL DEFAULT NULL,
      updated_at timestamp NULL DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 


    CREATE TABLE categories (
      id bigint(20) NOT NULL,
      ar_name varchar(100) NOT NULL,
      en_name varchar(100) NOT NULL,
      price bigint(20) NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      updated_at timestamp NOT NULL DEFAULT current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE failed_jobs (
      id bigint(20) UNSIGNED NOT NULL,
      uuid varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      connection text COLLATE utf8mb4_unicode_ci NOT NULL,
      queue text COLLATE utf8mb4_unicode_ci NOT NULL,
      payload longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      exception longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      failed_at timestamp NOT NULL DEFAULT current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE locations (
      id bigint(20) NOT NULL,
      lat varchar(255) NOT NULL,
      lng varchar(255) NOT NULL,
      street varchar(255) NOT NULL,
      city varchar(255) NOT NULL,
      country varchar(255) NOT NULL,
      user_id bigint(20) NOT NULL,
      type int(11) NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      updated_at timestamp NOT NULL DEFAULT current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    
    CREATE TABLE migrations (
      id int(10) UNSIGNED NOT NULL,
      migration varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      batch int(11) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    
    CREATE TABLE model_has_permissions (
      permission_id int(10) UNSIGNED NOT NULL,
      model_type varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      model_id bigint(20) UNSIGNED NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      
  CREATE TABLE model_has_roles (
    role_id int(10) UNSIGNED NOT NULL,
    model_type varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    model_id bigint(20) UNSIGNED NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


  INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
  (1, 'App\\Models\\User', 1);

    
CREATE TABLE orders (
  id bigint(20) UNSIGNED NOT NULL,
  Quantity text COLLATE utf8mb4_unicode_ci NOT NULL,
  details varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  category_id bigint(20) NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



CREATE TABLE password_resets (
  email varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  token varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  created_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE permissions (
  id int(10) UNSIGNED NOT NULL,
  name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  guard_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO permissions (id, name, guard_name, created_at, updated_at) VALUES
(1, 'access_users', 'web', NULL, NULL),
(3, 'admin_posts', 'web', NULL, NULL),
(4, 'admin_categories', 'web', NULL, NULL);



CREATE TABLE personal_access_tokens (
  id bigint(20) UNSIGNED NOT NULL,
  tokenable_type varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  tokenable_id bigint(20) UNSIGNED NOT NULL,
  name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  token varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  abilities text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  last_used_at timestamp NULL DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE posts (
  id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  header varchar(100) NOT NULL,
  content varchar(255) NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE roles (
  id int(10) UNSIGNED NOT NULL,
  name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  guard_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO roles (id, name, guard_name, created_at, updated_at) VALUES
(1, 'admin', 'web', NULL, NULL);


CREATE TABLE role_has_permissions (
  permission_id int(10) UNSIGNED NOT NULL,
  role_id int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO role_has_permissions (permission_id, role_id) VALUES
(1, 1),
(3, 1),
(4, 1);


CREATE TABLE users (
  id bigint(20) UNSIGNED NOT NULL,
  archive_id int(11) DEFAULT NULL,
  name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  email varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  draft_email varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  mobile bigint(20) NOT NULL,
  national_id bigint(14) NOT NULL,
  firebase_token bigint(20) DEFAULT NULL,
  removed tinyint(4) NOT NULL DEFAULT 2,
  city varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  email_verified_at timestamp NULL DEFAULT NULL,
  password varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  remember_token varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  search_text text COLLATE utf8mb4_unicode_ci NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE archive
  ADD PRIMARY KEY (id),
  ADD KEY related_id (related_id),
  ADD KEY parent_id (parent_id),
  ADD KEY user_id (user_id),
  ADD KEY short_name (short_name);

  ALTER TABLE archive_users
  ADD PRIMARY KEY (archive_id,user_id);

  ALTER TABLE categories
  ADD PRIMARY KEY (id);

  ALTER TABLE failed_jobs
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY failed_jobs_uuid_unique (uuid);

  ALTER TABLE locations
  ADD PRIMARY KEY (id);

  ALTER TABLE migrations
  ADD PRIMARY KEY (id);

  ALTER TABLE model_has_permissions
  ADD PRIMARY KEY (permission_id,model_id,model_type),
  ADD KEY model_has_permissions_model_type_model_id_index (model_type,model_id);


  
ALTER TABLE model_has_roles
ADD PRIMARY KEY (role_id,model_id,model_type),
ADD KEY model_has_roles_model_type_model_id_index (model_type,model_id);


ALTER TABLE orders
  ADD PRIMARY KEY (id);

  
ALTER TABLE password_resets
ADD KEY password_resets_email_index (email);


ALTER TABLE permissions
  ADD PRIMARY KEY (id);

  
ALTER TABLE personal_access_tokens
ADD PRIMARY KEY (id),
ADD UNIQUE KEY personal_access_tokens_token_unique (token),
ADD KEY personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type,tokenable_id);


ALTER TABLE posts
  ADD PRIMARY KEY (id);

  
ALTER TABLE roles
ADD PRIMARY KEY (id);


ALTER TABLE role_has_permissions
  ADD PRIMARY KEY (permission_id,role_id),
  ADD KEY role_has_permissions_role_id_foreign (role_id);

  
ALTER TABLE users
ADD PRIMARY KEY (id),
ADD UNIQUE KEY users_email_unique (email);


ALTER TABLE archive
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

  
ALTER TABLE categories
MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;


ALTER TABLE failed_jobs
  MODIFY id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

  
ALTER TABLE locations
MODIFY id bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE migrations
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
  
ALTER TABLE orders
MODIFY id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE permissions
  MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
  
ALTER TABLE personal_access_tokens
MODIFY id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;


ALTER TABLE posts
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

  
ALTER TABLE roles
MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;


ALTER TABLE users
  MODIFY id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

  
ALTER TABLE model_has_permissions
  ADD CONSTRAINT model_has_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE;

ALTER TABLE model_has_roles
  ADD CONSTRAINT model_has_roles_role_id_foreign FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE;


ALTER TABLE role_has_permissions
  ADD CONSTRAINT role_has_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
  ADD CONSTRAINT role_has_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE;
COMMIT;



    ");
    return 'success';
});
