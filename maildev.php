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