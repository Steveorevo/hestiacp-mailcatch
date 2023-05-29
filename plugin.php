<?php
/**
 * Plugin Name: MailCatcher
 * Plugin URI: https://github.com/virtuosoft-dev/hcpp-mailcatcher
 * Description: MailCatcher furnishes a multi-tenant interface for simulated email services, sendmail emulation, and SMTP services for each hosted domain.
 * Version: 1.0.0
 * Author: Virtuosoft (Stephen J. Carnam)
 * 
 */

// Register the install and uninstall scripts
global $hcpp;
require_once( dirname(__FILE__) . '/mailcatcher.php' );

$hcpp->register_install_script( dirname(__FILE__) . '/install' );
$hcpp->register_uninstall_script( dirname(__FILE__) . '/uninstall' );