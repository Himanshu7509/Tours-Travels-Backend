

console.log({
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.S3_BUCKET_NAME
});