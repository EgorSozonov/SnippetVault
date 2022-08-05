#!/bin/sh
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='mydb'" | grep -q 1 || psql -U postgres "CREATE ROLE sv_role; CREATE DATABASE mydb WITH OWNER=sv_role;"
psql -U postgres -d mydb -f Init.sql
