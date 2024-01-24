#!/bin/bash

npm run build;

cd ..;

rm -r backend/public/;
cp -r frontend/dist/ backend/public/;

git add .;
git commit -m 'build';
git push;

ssh server3v3@3v3.farm -p3031 "cd Documentos/seai-software/seai && git pull";