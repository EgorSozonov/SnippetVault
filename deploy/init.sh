#!/bin/sh
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='mydb'" | grep -q 1 || sudo -u postgres psql -c ";CREATE DATABASE mydb;"
sudo -u postgres psql -d mydb -f InitRoles.sql
sudo -u postgres psql -d mydb -f Init.sql
