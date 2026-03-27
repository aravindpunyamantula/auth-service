#!/bin/bash

mkdir -p keys

echo "Generating RSA 2048 private key... "

openssl genrsa -out ../keys/private.pem 2048

echo "Generating public key from private key .."

openssl rsa -in keys/private.pem -pubout -out ../keys/public.pem

echo "Keys generated successfully!"
echo "Private Key: keys/private.pem"
echo "Public Key: keys/public.pem"