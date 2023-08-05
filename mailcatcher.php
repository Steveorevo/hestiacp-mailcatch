<?php
/**
 * Extend the HestiaCP Pluginable object with our MailCatcher object for
 * our system-wide MailCatcher service.
 * 
 * @version 1.0.0
 * @license GPL-3.0
 * @link https://github.com/steveorevo/hcpp-mailcatcher
 * 
 */

 if ( ! class_exists( 'MailCatcher') ) {
    class MailCatcher {
        /**
         * Constructor, listen for the render events
         */
        public function __construct() {
            global $hcpp;
            $hcpp->mailcatcher = $this;
            $hcpp->add_action( 'hcpp_render_page', [ $this, 'hcpp_render_page' ] );
            $hcpp->add_action( 'nodeapp_startup_services', [ $this, 'nodeapp_startup_services' ] );
            $hcpp->add_action( 'priv_unsuspend_domain', [ $this, 'priv_unsuspend_domain' ] );
            $hcpp->add_action( 'hcpp_plugin_installed', [ $this, 'hcpp_plugin_installed' ] );
            $hcpp->add_action( 'hcpp_new_domain_ready', [ $this, 'hcpp_new_domain_ready' ] );
        }

        // Set MAILCATCHER_DOMAIN for PM2 started processes
        public function nodeapp_startup_services( $args ) {
            global $hcpp;
            $hcpp->log('mailcatcher->nodeapp_startup_services');
            $args['cmd'] = str_replace( 'pm2 start ', 'export MAILCATCHER_DOMAIN="' . $args['domain'] . '" && pm2 start ', $args['cmd'] );
            $hcpp->log($args);
            return $args;
        }

        // Ensure private/smtp.json is present the domain
        public function create_smtp_json( $user, $domain ) {
            $file = "/home/$user/web/$domain/private/smtp.json";
            if ( file_exists( $file ) ) return;
            global $hcpp;
            $password = $hcpp->nodeapp->random_chars( 16 );
            $content = "{\n  \"username\": \"$domain\",\n  \"password\": \"$password\",\n  \"port\": 2525\n}";
            file_put_contents( $file, $content );
            shell_exec( "chown $user:mailcatcher $file && chmod 640 $file" );
        }

        // Setup the MailCatcher Server instance for the domain
        public function setup( $user, $domain ) {
            global $hcpp;

            // Create the nginx.conf_mailcatcher file.
            $conf = "/home/$user/conf/web/$domain/nginx.conf_mailcatcher";
            $content = file_get_contents( __DIR__ . '/conf-web/nginx.conf_mailcatcher' );
            file_put_contents( $conf, $content );

            // Create the nginx.ssl.conf_mailcatcher file.
            $conf = "/home/$user/conf/web/$domain/nginx.ssl.conf_mailcatcher";
            $content = file_get_contents( __DIR__ . '/conf-web/nginx.ssl.conf_mailcatcher' );
            file_put_contents( $conf, $content );

            // Ensure system.ports is included
            if ( file_exists( '/usr/local/hestia/data/hcpp/ports/system.ports' ) ) {
                $conf = "/home/$user/conf/web/$domain/nginx.forcessl.conf_system_ports";
                if ( ! file_exists( $conf ) ) {
                    file_put_contents( $conf, 'include /usr/local/hestia/data/hcpp/ports/system.ports;' );
                }
                $conf = "/home/$user/conf/web/$domain/nginx.hsts.conf_system_ports";
                if ( ! file_exists( $conf ) ) {
                    file_put_contents( $conf, 'include /usr/local/hestia/data/hcpp/ports/system.ports;' );
                }
            }else{
                $hcpp->log( 'Warning: /usr/local/hestia/data/hcpp/ports/system.ports not found' );
            }
            $this->start();
        }

        // Start mailcatcher and save the process list
        public function start() {
            $cmd = 'if ! runuser -s /bin/bash -l "mailcatcher" -c "cd /opt/mailcatcher && export NVM_DIR=/opt/nvm && source /opt/nvm/nvm.sh && pm2 list" | grep -q "mailcatcher_app"; ';
            $cmd .= 'then runuser -s /bin/bash -l "mailcatcher" -c "cd /opt/mailcatcher && export NVM_DIR=/opt/nvm && source /opt/nvm/nvm.sh ; pm2 start mailcatcher.config.js ; pm2 save --force"; fi';
            global $hcpp;
            $cmd = $hcpp->do_action( 'mailcatcher_start', $cmd );
            $hcpp->log( shell_exec( $cmd ) );
        }
        
        public function priv_unsuspend_domain( $args ) {
            $user = $args[0];
            $domain = $args[1];
            $this->create_smtp_json( $user, $domain );
            $this->setup( $user, $domain );
            return $args;
        }
        public function hcpp_new_domain_ready( $args ) {
            $user = $args[0];
            $domain = $args[1];
            $this->create_smtp_json( $user, $domain );
            $this->setup( $user, $domain );
            return $args;
        }

        // Add MailCatcher icon next to our web domain list and button to domain edit pages.
        public function hcpp_render_page( $args ) {
            if ( $args['page'] == 'list_web' ) {
                $args = $this->render_list_web( $args );
            }
            if ( $args['page'] == 'edit_web' ) {
                $args = $this->render_edit_web( $args );
            }
            return $args;
        }

        // Add MailCatcher button to our web domain edit page.
        public function render_edit_web( $args ) {
                global $hcpp;
                $domain = $_GET['domain'];
                $content = $args['content'];

                // Create white envelope icon button to appear before Quick Installer button
                $code = '<a href="https://' . $domain . '/mailcatcher" target="_blank" class="button button-secondary ui-button cancel" ';
                $code .= 'dir="ltr"><i class="fas fa-envelope status-icon highlight">';
                $code .= '</i> MailCatcher</a>';

                // Inject the button into the page's toolbar buttonstrip
                $quick = '"fas fa-magic status-icon blue'; // HestiaCP 1.6.X
                if ( strpos( $content, $quick ) === false ) {
                    $quick = '"fas fa-magic icon-blue'; // HestiaCP 1.7.X
                }
                $before = $hcpp->getLeftMost( $content, $quick );
                $after = $quick . $hcpp->delLeftMost( $content, $quick );
                $after = '<a href' . $hcpp->getRightMost( $before, '<a href' ) . $after;
                $before = $hcpp->delRightMost( $before, '<a href' );
                $content = $before . $code . $after;
                $args['content'] = $content;
                return $args;
        }

        // Add MailCatcher icon to our web domain list page.
        public function render_list_web( $args ) {
                global $hcpp;
                $content = $args['content'];

                // Create white envelope icon before pencil/edit icon
                $div = '<li class="units-table-row-action shortcut-enter" data-key-action="href">';
                $code = '<li class="units-table-row-action" data-key-action="href">
                            <a class="units-table-row-action-link" href="https://%domain%/mailcatcher" target="_blank" title="Open MailCatcher">
                                <i class="fas fa-envelope mailcatcher"></i>
                                <span class="u-hide-desktop">MailCatcher</span>
                            </a>
                        </li>';
                $new = '';

                // Inject the envelope icon for each domain
                while( false !== strpos( $content, $div ) ) {
                    $new .= $hcpp->getLeftMost( $content, $div );
                    $content = $hcpp->delLeftMost( $content, $div );
                    $domain = $hcpp->getLeftMost( $hcpp->delLeftMost( $content, '?domain=' ), '&' );
                    $new .= str_replace( '%domain%', $domain, $code ) . $div;
                }
                $new .= $content;
                $new .= '<style>i.mailcatcher:hover{color: white;}</style>';
                $args['content'] = $new;
                return $args;
        }

        // Allocate port on install
        public function hcpp_plugin_installed( $plugin_name ) {
            if ( $plugin_name != 'mailcatcher' ) return $plugin_name;
            global $hcpp;
            $port = $hcpp->allocate_port( 'mailcatcher_port' );
            return $plugin_name;
        }

        // TODO: when domain is deleted, cleanup the domain in mailcatcher; i.e. rm -rf /tmp/mailcatcher/$domain_*
    }
    new MailCatcher();
}