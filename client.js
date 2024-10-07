import { S3Client, GetObjectCommand, CreateBucketCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from 'fs';
//intitalize s3 cient with specific users access key and security key
const client = new S3Client({
    region: 'ap-south-1',
    // credentials: {
    //     accessKeyId: '',
    //     secretAccessKey: ''
    // },
    //another trial for permisionless
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    },
});

//now we have amazon aws client present with specific user having some lmited rights
//--as that suser has ,sh bucket access if he want to user getObject related commands

const getObjectFroms3 = async (key) => {
    try {
        // 1)using writable object stream
        // const data = client.send(
        //     new GetObjectCommand({
        //         Bucket: 'sahil-sadekar-dev',
        //         Key: key
        //     })
        // );

        // //before returning try to make stream which downloads it by using rite stream
        // const writableStream = fs.createWriteStream('./downloaded-file.jpg');
        // (await data).Body.pipe(writableStream);
        // console.log("requuested object downloaded successfully...");
        // return data;


        // 2)approch 2 using presigned url generator
        return getSignedUrl(client, new GetObjectCommand({
            Bucket: 'sahil-sadekar-dev',
            Key: key
        }));
    }
    catch (err) {
        console.log("problem arrived: ", err.message);
    }
}

// console.log('getObjectFroms3', await getObjectFroms3('tom.jpg'));
// console.log('getObjectFroms3', await getObjectFroms3('tom.jpg'));


//slef understannding notes
//getObbjectcommand returns information and metadata about object about requested s3 objet=ct
//containss metdata object as well as object data as stream
//Body: A readable stream containing the actual contents of the object. Since it's a stream, you may need to handle it using piping or convert it to a buffer depending on how you want to process the data.

// Metadata: The metadata of the object (like its size, type, and other attributes).
// format of response:
// {
//     "Body": <ReadableStream>,   // The actual object data in a stream
//     "AcceptRanges": "bytes",
//     "LastModified": "2023-10-01T12:00:00Z",
//     "ContentLength": 1024,
//     "ETag": "\"1a2b3c4d5e6f7890\"",
//     "ContentType": "image/jpeg",
//     "Metadata": {
//       "x-amz-meta-custom-header": "custom-value"
//     },
//     "ContentEncoding": null,
//     "ContentDisposition": null,
//     "CacheControl": null
//   }

//To handle the stream returned in the Body, you typically pipe it to a file or convert it to a buffer.

//also try to implement with signed url and user having not bucket access and observer changes
// 1)make private s3 bucket
//2)insert ojects in that
//3)

//create buckent using clinet
async function createBucket(bucketName) {
    try {
        //append timestamp to possibly make it as ubique bucket
        const timestamp = Date.now();
        const validBucketName = bucketName.toLowerCase() + '-' + timestamp;
        return await client.send(new CreateBucketCommand({
            Bucket: validBucketName,
        }));
    }
    catch (e) {
        console.error("Error creating bucket", e.message);
    }
}

//trial for create bucket
// console.log('create bucket flags',createBucket('sdkBucket123'));

//pushing objects to s3 using s3 client sdk
async function pushDataToBucket(bucketName, key, body) {
    try {
        return await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body
        }));
    }
    catch (e) {
        console.error("Error creating bucket", e.message);
    }
}

// console.log('create bucket flags',pushDataToBucket('sahil-sadekar-dev',"demo.txt","this is text inside file"));