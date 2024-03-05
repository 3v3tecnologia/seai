#!/bin/bash -x

[[ -n "$1" &&  "$1" = "production" ]] && {
  echo "🔍 ARG = $1"

  node dist/src/index.js
} || {
  npm run dev:watch
}
