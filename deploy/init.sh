#!/bin/sh
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='mydb'" | grep -q 1 || psql -U postgres -c ";CREATE DATABASE mydb;"
psql -U postgres -d mydb -f InitRoles.sql
psql -U postgres -d mydb -f Init.sql
