<?php
/**
 * Plugin Name: MailCatcher
 * Plugin URI: https://github.com/steveorevo/hestiacp-mailcatcher
 * Description: MailCatcher furnishes a multi-tenant interface for simulated email services, sendmail emulation, and SMTP services for each hosted domain.
 */

// Register the install and uninstall scripts
global $hcpp;
require_once( dirname(__FILE__) . '/mailcatcher.php' );

$hcpp->register_install_script( dirname(__FILE__) . '/install' );
$hcpp->register_uninstall_script( dirname(__FILE__) . '/uninstall' );