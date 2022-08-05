#!/bin/sh
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='mydb'" | grep -q 1 || psql -U postgres "CREATE DATABASE mydb WITH OWNER=sv_dba;"
psql -U postgres -d mydb -f InitRoles.sql
psql -U postgres -d mydb -f Init.sql
