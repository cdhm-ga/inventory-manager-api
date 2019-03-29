#!/bin/bash

API="http://localhost:4741"
URL_PATH="/storefront-items"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "storefrontItem": {
      "warehouseItem": "'"${WH_ID}"'",
      "owner": "'"${OWNER}"'",
      "quantity": "'"${QUANTITY}"'"
    }
  }'

echo
