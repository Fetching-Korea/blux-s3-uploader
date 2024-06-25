import {AWSError} from "aws-sdk";

const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

export default class S3Uploader {
    async upload(localFilePath: string, bucket: string, remoteFilePath: string): Promise<void> {
        const s3 = new AWS.S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });
        const uploadParams = {
            Bucket: bucket,
            ContentType: 'text/csv',
            Key: remoteFilePath,
            Body: fs.createReadStream(localFilePath)
        };
        s3.upload(uploadParams, (err, data) => {
            if (err) {
                console.log(err);
            }
        })
    }
    
    /**
     * 외부 버킷에 업로드 잘 됐는지 확인하는 용도이므로
     * S3 버킷 이름 및 키 하드코딩 해놓음
     * */
    async download() {
        const s3 = new AWS.S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });
        const downloadParams: Object = {
            Bucket: 'blux-external',
            Key: 'fa71ae1a/users/catalog.csv'
        };
        s3.getObject(downloadParams, (err: AWSError, data: any) => {
            if (err) {
                console.error(err);
                return;
            }
            fs.writeFileSync('./files/downloaded.csv', data.Body);
        });
    }
}

