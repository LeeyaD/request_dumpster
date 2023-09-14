DATABASE=$1

dropdb $DATABASE
createdb $DATABASE

psql -d $DATABASE < schema.sql

# From the command line run `bash database_setup.sh requestInspect` , the `database_setup.sh`
# file is a simple bash script that drops the `requestInspect` database if it exists,
# re-creates it, and sets up all the required schema and seed data
# (**please note the database name used in our backend is `requestInspect` so
# please use the same name to have the program run properly**)
