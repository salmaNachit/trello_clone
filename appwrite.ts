import { Client, Account, ID, Databases, Storage } from "appwrite";

const client = new Client()
.setEndpoint("https://cloud.appwrite.io/v1")
.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

const account = new Account(client);
const databases = new Databases(client);
export const storage = new Storage(client);

export { client, account, databases, Storage, ID}

/* const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65a15e23553cac30635b');
 */
//database id 65a169c6c4312a4ff82c
