#!/bin/bash

BASE_URL="http://localhost:8080"

USERNAME="user$(date +%s)"
EMAIL="${USERNAME}@test.com"
PASSWORD="Pass@1234"

echo "Registering user..."
REGISTER=$(curl -s -X POST $BASE_URL/api/auth/register \
-H "Content-Type: application/json" \
-d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo $REGISTER | jq

echo "Logging in..."
LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
-H "Content-Type: application/json" \
-d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo $LOGIN | jq

ACCESS_TOKEN=$(echo $LOGIN | jq -r '.access_token')
REFRESH_TOKEN=$(echo $LOGIN | jq -r '.refresh_token')

echo "Accessing profile..."
curl -s $BASE_URL/api/profile \
-H "Authorization: Bearer $ACCESS_TOKEN" | jq

echo "Refreshing token..."
echo "REFRESH RESPONSE:"
echo $REFRESH

REFRESH=$(curl -s -X POST $BASE_URL/api/auth/refresh \
-H "Content-Type: application/json" \
-d "{\"refresh_token\":\"$REFRESH_TOKEN\"}")

echo $REFRESH | jq

NEW_ACCESS=$(echo $REFRESH | jq -r '.access_token')

echo "Accessing profile with new token..."
curl -s $BASE_URL/api/profile \
-H "Authorization: Bearer $NEW_ACCESS" | jq

echo "Logging out..."
curl -s -X POST $BASE_URL/api/auth/logout \
-H "Content-Type: application/json" \
-d "{\"refresh_token\":\"$REFRESH_TOKEN\"}"

echo "Flow completed!"