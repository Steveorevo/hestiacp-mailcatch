<?php
if ( getenv( 'MAILCATCHER_DOMAIN' ) == '' ) {
   putenv( 'MAILCATCHER_DOMAIN=' . array_pop( explode( '@', ini_get( 'sendmail_path' ) ) ) );
}