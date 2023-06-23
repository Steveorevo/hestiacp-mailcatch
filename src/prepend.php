<?php
if (getenv('MAILCATCHER_DOMAIN') == '') {
   $sendmail_path = ini_get('sendmail_path');
   $parts = explode('@', $sendmail_path);
   $mailcatcher_domain = array_pop($parts);
   putenv('MAILCATCHER_DOMAIN=' . $mailcatcher_domain);
}
