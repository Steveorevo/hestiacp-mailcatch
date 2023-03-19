<?php
/**
 * Extend the HestiaCP Pluginable object with our MailDev object for
 * our system-wide MailDev service.
 * 
 * @version 1.0.0
 * @license GPL-3.0
 * @link https://github.com/steveorevo/hestiacp-maildev
 * 
 */

 if ( ! class_exists( 'MailDev') ) {
    class MailDev {
        /**
         * Constructor, listen for the render events
         */
        public function __construct() {
            global $hcpp;
            $hcpp->maildev = $this;
            $hcpp->add_action( 'render_page', [ $this, 'render_page' ] );
            $hcpp->add_action( 'priv_unsuspend_domain', [ $this, 'priv_unsuspend_domain' ] );
            $hcpp->add_action( 'new_web_domain_ready', [ $this, 'new_web_domain_ready' ] );
        }


        // Ensure smtp.json is present for each domain
        public function create_smtp_json( $user, $domain ) {
            $file = "/home/$user/web/$domain/private/smtp.json";
            if ( file_exists( $file ) ) return;
            global $hcpp;
            $password = $hcpp->nodeapp->random_chars( 16 );
            $content = "{\n  \"username\": \"$domain\",\n  \"password\": \"$password\",\n  \"port\": 2525\n}";
            file_put_contents( $file, $content );
            shell_exec( "chown $user:maildev $file && chmod 640 $file" );
        }

        public function priv_unsuspend_domain( $args ) {
            
        }

        public function new_web_domain_ready( $args ) {

        }

        // Add MailDev icon next to each domain
        public function render_page() {
            global $hcpp;
        }

        // Startup MailDev server
        public function start() {
            global $hcpp;
            $hcpp->log( 'Starting MailDev server' );
            $port = $hcpp->allocate_port( 'maildev_port' );
            $hcpp->log( 'MailDev server port: ' . $port );
        }
    }
    new MailDev();
}