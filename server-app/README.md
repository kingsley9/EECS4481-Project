# Help Desk App Server


# Dev Setup
## Windows
1. Install WSL: https://www.windowscentral.com/how-install-wsl2-windows-10
2. Install Node and NPM. Run the following commands in the linux (WSL) terminal:
```
sudo apt update && sudo apt upgrade
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

### Setup DB
1. Run the following script to install postgresql and create DB: `bash setup-db.sh`
2. Login to postgresql: `psql -h localhost -U dbadmin -W -b messaging_app`. You need to put in your password following runnning the command.
3. Run the sql scripts:
```
\i sql/create-tables.sql
``` 

### Setup Node

1. Restart the terminal to update the environment variables.
2. Run the following commands to install require Node version:
```
nvm install
nvm use
```
3. Install list of required dependencies: `npm i`
4. Run the server: `npm start`

