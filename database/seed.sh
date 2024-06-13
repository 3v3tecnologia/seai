#!/usr/bin/env bash

DIRECTORY="seeds"

HOST="localhost"
# HOST="0.0.0.0"

function split_filename() {
    local filename="$1"

    local name="${filename%.*}"

    echo $name
}

files=$(ls seeds | grep '\.sql')

for sql_file in $files
do
    
    filename=`split_filename $sql_file`

    database_name=$filename

    echo "🔍 Connecting to the database $database_name ..."
    
    echo "Running the file: $sql_file"

    psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$HOST/$database_name?sslmode=disable" < "$DIRECTORY/$sql_file"
    wait

    exit_status=$? 

    if [ $exit_status -eq 0 ]; then
        echo "✅ Connection successful and query executed."
    else
        echo "❌ Error encountered during connection or query execution."
        exit 1
    fi


    sleep 2
done
    


