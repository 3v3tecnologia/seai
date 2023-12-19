#!/bin/bash

cd ..;

npm run build;
rm -r backend/public/;
cp frontend/dist/ backend/public/;

git add .;
git commit -m 'build';
git push;