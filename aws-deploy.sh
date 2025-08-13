aws s3 sync dist/public/ s3://nerdle-serverless-app/connect --acl public-read

aws cloudfront create-invalidation --distribution-id E2GV7CU2G3KWL8 --paths "/connect/*" "/connect" "/connect*"