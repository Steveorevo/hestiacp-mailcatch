# hcpp-mailcatcher
A plugin for Hestia Control Panel (via hesitacp-pluginable) that furnishes multitenancy services for simulated SMTP, sendmail, and a unique web GUI for previewing all outgoing emails for each user/web domain. 


## Attribution
Based on the slick interface and work from [MailDev](https://github.com/maildev/maildev) and a simulated sendmail compatible command line utility, [catchmail-node](https://github.com/xavierpriour/catchmail-node), these projects have been included and modified with new multitenant capabilities and enhanced compatibility to work "out-of-the-box" under the HestiaCP based control panel. 

## Usage
Use MailCatcher to test applications that send mail via the local built-in SMTP server and/or sendmail (like PHP's mail() function); this plugin will rename the existing `/usr/sbin/sendmail` to `/usr/sbin/sendmail.sav` and symlink to our sendmail replacement. Unique credentials for the SMTP services can be found in `/home/<username>/web/<domain>/private/smtp.json`. Default SMTP port is 2525 and the username must match the given `<domain>` name. 

The built-in GUI web client can be found at the URL path `http(s)://<domain>/mailcatcher` and as an envelope icon in HestiaCP's web domain listing and edit pages.

If you install mailcatcher ***after*** you have already created sites; then you must suspend/unsuspned the given site to initialize mailcatcher services for your domain.


## Installation
HCPP-MailCatcher requires an Ubuntu based installation of [Hestia Control Panel](https://hestiacp.com) in addition to an installation of [HestiaCP-Pluginable](https://github.com/virtuosoft-dev/hestiacp-pluginable) ***and*** [HCPP-NodeApp](https://github.com/virtuosoft-dev/hcpp-nodeapp) to function; please ensure that you have first installed both Pluginable and NodeApp on your Hestia Control Panel before proceeding. Switch to a root user and simply clone this project to the /usr/local/hestia/plugins folder. It should appear as a subfolder with the name `mailcatcher`, i.e. `/usr/local/hestia/plugins/mailcatcher`.

First, switch to root user:
```
sudo -s
```

Then simply clone the repo to your plugins folder, with the name `mailcatcher`:

```
cd /usr/local/hestia/plugins
git clone https://github.com/virtuosoft-dev/hcpp-mailcatcher mailcatcher
```

Note: It is important that the plugin folder name is `mailcatcher`.

Be sure to logout and login again to your Hestia Control Panel as the admin user or, as admin, visit Server (gear icon) -> Configure -> Plugins -> Save; the plugin will immediately start installing MailCatcher server depedencies in the background. A notification will appear under the admin user account indicating *"MailCatcher plugin has finished installing"* when complete. This may take awhile before the options appear in Hestia. You can force manual installation via root level SSH:

```
sudo -s
cd /usr/local/hestia/plugins/mailcatcher
./install
php -r 'require_once("/usr/local/hestia/web/pluginable.php");global $hcpp;$hcpp->do_action("hcpp_plugin_installed", "mailcatcher");'
touch "/usr/local/hestia/data/hcpp/installed/mailcatcher"
```

## Support the creator
You can help this author's open source development endeavors by donating any amount to Stephen J. Carnam @ Virtuosoft. Your donation, no matter how large or small helps pay for essential time and resources to create MIT and GPL licensed projects that you and the world can benefit from. Click the link below to donate today :)
<div>
         

[<kbd> <br> Donate to this Project <br> </kbd>][KBD]


</div>


<!---------------------------------------------------------------------------->

[KBD]: https://virtuosoft.com/donate

https://virtuosoft.com/donate
