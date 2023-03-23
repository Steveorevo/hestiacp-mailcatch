# hestiacp-mailcatch
A plugin for Hestia Control Panel (via hesitacp-pluginable) that furnishes multitenancy services for simulated SMTP, sendmail, and a unique web GUI for previewing all outgoing emails for each user/web domain. 

&nbsp;
> :warning: !!! Note: this repo is in progress; when completed, a release will appear in the release tab.

## Attribution
Based on the slick interface and work from [MailDev](https://github.com/maildev/maildev) and a simulated sendmail compatible command line utility, [catchmail-node](https://github.com/xavierpriour/catchmail-node), these projects have been included and modified with new multitenant capabilities and enhanced compatibility to work "out-of-the-box" under the HestiaCP based control panel. 

## Usage
Use MailCatch to test applications that send mail via the local built-in SMTP server and/or sendmail (like PHP's mail() function); this plugin will rename the existing `/usr/sbin/sendmail` to `/usr/sbin/sendmail.sav` and symlink to our sendmail replacement. Unique credentials for the SMTP services can be found in `/home/<username>/web/<domain>/private/smtp.json`. Default SMTP port is 2525 and the username must match the given `<domain>` name. The built-in GUI web client can be found at the URL path `http(s)://<domain>/mailcatch` and as an envelope icon in HestiaCP's web domain listing and edit pages.


## Installation
HestiaCP-MailCatch requires an Ubuntu based installation of [Hestia Control Panel](https://hestiacp.com) in addition to an installation of [HestiaCP-Pluginable](https://github.com/steveorevo/hestiacp-pluginable) ***and*** [HesitaCP-NodeApp](https://github.com/steveorevo/hestiacp-nodeapp) to function; please ensure that you have first installed both Pluginable and NodeApp on your Hestia Control Panel before proceeding. Switch to a root user and simply clone this project to the /usr/local/hestia/plugins folder. It should appear as a subfolder with the name `mailcatch`, i.e. `/usr/local/hestia/plugins/mailcatch`.

First, switch to root user:
```
sudo -s
```

Then simply clone the repo to your plugins folder, with the name `mailcatch`:

```
cd /usr/local/hestia/plugins
git clone https://github.com/steveorevo/hestiacp-mailcatch mailcatch
```

Note: It is important that the plugin folder name is `mailcatch`.

Be sure to logout and login again to your Hestia Control Panel as the admin user or, as admin, visit Server (gear icon) -> Configure -> Plugins -> Save; the plugin will immediately start installing MailCatch server depedencies in the background. A notification will appear under the admin user account indicating *"MailCatch plugin has finished installing"* when complete. This may take awhile before the options appear in Hestia. You can force manual installation via root level SSH:

```
sudo -s
cd /usr/local/hestia/plugins/mailcatch
./install
```