# Help Desk App Server

# Dev Setup
## Repository Initial Setup
1. Create personal access token (with "repo" access): https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
2. Clone repository: `git clone https://github.com/kingsley9/EECS4481-Project-T5.git`. First time, it'll ask for your username and password (put personal access token here). s
3. Setup Git configs:
```
git config --global user.name "Your Name"
git config --global user.email "email@gmail.com"
```
## Setup VSCode
1. Run Ctrl+Shift+P
2. Search for 'Clone Repository'
3. Put the repository URL: https://github.com/kingsley9/EECS4481-Project-T5.git
4. Login to Github and authorize VSCode Access.

## Initial Windows Setup
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
4. Run the server: `PGUSER="dbadmin" PGHOST="127.0.0.1" PGDATABASE="messaging_app" PGPASSWORD="password" PGPORT="5432" JWT_SECRET="password" npm start`


## Git Flow for changes
1. Run `git pull` on regular basis to the get updated code from Github.
2. When working on changes create a separate branch: `git checkout -b new-feature`
3. Once done with all the changes add all files: `git add *`
4. Add your commit message: `git commit -m "feat: added a new feature"`
5. Push all changes to github: `git push origin head`
6. Go to Github page "https://github.com/kingsley9/EECS4481-Project-T5"
7. You should be able to open PR to merge those changes to main branch. This way we can review PR before changes are commited, if needed.
