#!/bin/bash

# Install PostgreSQL server
sudo apt-get update
sudo apt-get install postgresql

# Enable and start the PostgreSQL server
sudo systemctl enable postgresql
sudo service postgresql start

# Create the messaging_app database
sudo -u postgres psql -c "CREATE DATABASE messaging_app;"

# Create the dbadmin user and grant all permissions to the messaging_app database
sudo -u postgres psql -c "CREATE USER dbadmin WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE messaging_app TO dbadmin;"