aws s3 sync build/ s3://nerdle-serverless-app/myaccount --acl public-read

aws cloudfront create-invalidation --distribution-id E2GV7CU2G3KWL8 --paths "/myaccount/*" "/myaccount" "/myaccount*"