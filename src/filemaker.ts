import Dao from "./dao";
import {RowDataPacket} from "mysql2/promise";
import {decryptInfo} from "./crypt";
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');

export default class FileMaker {
    dao: Dao = new Dao();
    async makeUsersData(chunkSize: number): Promise<Object[]> {
        const users: {[k: string]: any}[] = [];
        let currentId: number = 0;
        const maxId: number = await this.dao.selectMaxUserId();
        while (currentId < maxId) {
            const chunk = await this.dao.selectUsers(currentId, chunkSize);
            console.log(`got ids from ${chunk[0]['id']} ~ ${chunk[chunk.length - 1]['id']}`);
            currentId = chunk[chunk.length-1]['id'];
            chunk.map((each: RowDataPacket) => {
                users.push(this.decryptUserRow(each));
            })
        }
        return users;
    }
    
    decryptUserRow(userRow: RowDataPacket): Object {
        const decryptedUserRow: {[k: string]: any} = { ...userRow };
        if (userRow['email']) {
            decryptedUserRow['email'] = decryptInfo(userRow['email']);
        }
        if (userRow['phone_number']) {
            decryptedUserRow['phone_number'] = decryptInfo(userRow['phone_number']);
        }
        return decryptedUserRow;
    }
    
    async writeUsersAsCSV(localFilePath: string, data: Object[]): Promise<void> {
        const csvWriter = createObjectCsvWriter({
            path: localFilePath,
            header: [
                { id: 'id', title: 'id' },
                { id: 'name', title: 'name' },
                { id: 'phone_number', title: 'phone_number' },
                { id: 'email', title: 'email' },
                { id: 'email_allow', title: 'email_allow' },
                { id: 'sms_allow', title: 'sms_allow' },
                { id: 'push_allow', title: 'push_allow' },
                { id: 'nightly_push_allow', title: 'nightly_push_allow' },
                { id: 'marketing_push_allow', title: 'marketing_push_allow' }
            ]
        });
        console.log(`started writing to file`);
        await csvWriter.writeRecords(data);
        console.log(`finished writing to file`);
    }

    async makeUsersWithBestReviewsData(startDate: string, endDate: string): Promise<Object[]> {
        const users: {[k: string]: any}[] = [];
        const chunk = await this.dao.selectUsersWithBestReviews(startDate, endDate);
        chunk.map((each: RowDataPacket) => {
            users.push(this.decryptUserRow(each));
        })
        return users;
    }

    async makeUsersWithExpiringPointsData(expiryDate: string): Promise<Object[]> {
        const users: {[k: string]: any}[] = [];
        const chunk = await this.dao.selectUsersWithExpiringPoints(expiryDate);
        chunk.map((each: RowDataPacket) => {
            users.push(this.decryptUserRow(each));
        })
        return users;
    }

    async makeUsersWithExpiringCouponsData(expiryDate: string): Promise<Object[]> {
        const users: {[k: string]: any}[] = [];
        const chunk = await this.dao.selectUsersWithExpiringCoupons(expiryDate);
        chunk.map((each: RowDataPacket) => {
            users.push(this.decryptUserRow(each));
        })
        return users;
    }

    async makeTestUsersData(): Promise<Object[]> {
        const users: {[k: string]: any}[] = [];
        const chunk = await this.dao.selectTestUsers();
        chunk.map((each: RowDataPacket) => {
            users.push(this.decryptUserRow(each));
        })
        return users;
    }

    async writeUsersWithBestReviewsAsCSV(localFilePath: string, data: Object[]): Promise<void> {
        const csvWriter = createObjectCsvWriter({
            path: localFilePath,
            header: [
                { id: 'user_id', title: 'user_id' },
                { id: 'first_name', title: 'first_name' },
                { id: 'last_name', title: 'last_name' },
                { id: 'phone_number', title: 'phone_number' },
                { id: 'email_address', title: 'email_address' },
                { id: 'email_allow', title: 'email_allow' },
                { id: 'sms_allow', title: 'sms_allow' },
                { id: 'push_allow', title: 'push_allow' },
                { id: 'nighttime_notification_consent', title: 'nighttime_notification_consent' },
                { id: 'marketing_notification_consent', title: 'marketing_notification_consent' },
                { id: 'nickname', title: 'nickname' },
                { id: 'month', title: 'month' },
                { id: 'points', title: 'points' }
            ]
        });
        console.log(`started writing to file`);
        await csvWriter.writeRecords(data);
        console.log(`finished writing to file`);
    }

    async writeUsersWithExpiringPointsAsCSV(localFilePath: string, data: Object[]): Promise<void> {
        const csvWriter = createObjectCsvWriter({
            path: localFilePath,
            header: [
                { id: 'user_id', title: 'user_id' },
                { id: 'first_name', title: 'first_name' },
                { id: 'last_name', title: 'last_name' },
                { id: 'phone_number', title: 'phone_number' },
                { id: 'email_address', title: 'email_address' },
                { id: 'email_allow', title: 'email_allow' },
                { id: 'sms_allow', title: 'sms_allow' },
                { id: 'push_allow', title: 'push_allow' },
                { id: 'nighttime_notification_consent', title: 'nighttime_notification_consent' },
                { id: 'marketing_notification_consent', title: 'marketing_notification_consent' },
                { id: 'nickname', title: 'nickname' },
                { id: 'points', title: 'points' },
                { id: 'expiry_date', title: 'expiry_date' }
            ]
        });
        console.log(`started writing to file`);
        await csvWriter.writeRecords(data);
        console.log(`finished writing to file`);
    }

    async writeUsersWithExpiringCouponsAsCSV(localFilePath: string, data: Object[]): Promise<void> {
        const csvWriter = createObjectCsvWriter({
            path: localFilePath,
            header: [
                { id: 'user_id', title: 'user_id' },
                { id: 'first_name', title: 'first_name' },
                { id: 'last_name', title: 'last_name' },
                { id: 'phone_number', title: 'phone_number' },
                { id: 'email_address', title: 'email_address' },
                { id: 'email_allow', title: 'email_allow' },
                { id: 'sms_allow', title: 'sms_allow' },
                { id: 'push_allow', title: 'push_allow' },
                { id: 'nighttime_notification_consent', title: 'nighttime_notification_consent' },
                { id: 'marketing_notification_consent', title: 'marketing_notification_consent' },
                { id: 'nickname', title: 'nickname' },
                { id: 'expiry_date', title: 'expiry_date' }
            ]
        });
        console.log(`started writing to file`);
        await csvWriter.writeRecords(data);
        console.log(`finished writing to file`);
    }

    async writeTestUsersAsCSV(localFilePath: string, data: Object[]): Promise<void> {
        const csvWriter = createObjectCsvWriter({
            path: localFilePath,
            header: [
                { id: 'user_id', title: 'user_id' },
                { id: 'first_name', title: 'first_name' },
                { id: 'last_name', title: 'last_name' },
                { id: 'phone_number', title: 'phone_number' },
                { id: 'email_address', title: 'email_address' },
                { id: 'email_allow', title: 'email_allow' },
                { id: 'sms_allow', title: 'sms_allow' },
                { id: 'push_allow', title: 'push_allow' },
                { id: 'nighttime_notification_consent', title: 'nighttime_notification_consent' },
                { id: 'marketing_notification_consent', title: 'marketing_notification_consent' },
                { id: 'nickname', title: 'nickname' },
            ]
        });
        console.log(`started writing to file`);
        await csvWriter.writeRecords(data);
        console.log(`finished writing to file`);
    }
    
}
