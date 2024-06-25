import {Connection, createConnection, FieldPacket, QueryResult, RowDataPacket} from 'mysql2/promise';
require('dotenv').config()

export default class Dao {
    async connect(): Promise<Connection> {
        const result = createConnection({
            host: process.env.HOST ,
            port: Number(process.env.PORT),
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
        });
        return result;
    }
    async selectUser(id: number): Promise<RowDataPacket> {
        const connection = await this.connect();
        const [results, fields] = await connection.query(
            `select *
            from user
            where idx = ${id}`
        );
        return results[0] as RowDataPacket;
    }
    async countUsers(): Promise<number> {
        const connection = await this.connect();
        const [results, fields] = await connection.query(
            `
            select count(*) as cnt
            from user
            `
        );
        return results[0]['cnt'] as number;
    }
    async selectMaxUserId(): Promise<number> {
        const connection = await this.connect();
        const [results, fields] = await connection.query(
            `
            select max(idx) as max_id
            from user
            `
        );
        return results[0]['max_id'] as number;
    }
    async selectUsers(lastReadId: number, limit: number = 1000): Promise<RowDataPacket[]> {
        const connection = await this.connect();
        const query: string = `
            select
                idx as id,
                name as name,
                phone_number as phone_number,
                email as email,
                email_allow as email_allow,
                sms_allow as sms_allow,
                push_allow as push_allow,
                nightly_push_allow as nightly_push_allow,
                marketing_push_allow as marketing_push_allow
            from
                commerce.user
            where
                idx > ${lastReadId}
            order by 
                idx asc
            limit
                ${limit}
        `;
        const [rows, fields] = await connection.query(query);
        return rows as RowDataPacket[];
    }
    
    async selectUsersWithBestReviews(startDate: string, endDate: string): Promise<RowDataPacket[]> {
        const connection = await this.connect();
        const query: string = `
        select 
            user.idx as user_id,
            user.name as first_name,
            '' as last_name,
            user.phone_number as phone_number,
            user.email as email_address,
            user.email_allow as email_allow,
            user.sms_allow as sms_allow,
            user.push_allow as push_allow,
            user.nightly_push_allow as nighttime_notification_consent,
            user.marketing_push_allow as marketing_notification_consent,
            '' as nickname,
            month(review.created_at) as month,
            sum(point.point_total) as points
        from
            commerce.user user
            inner join commerce.review review on user.idx = review.user_id
            inner join commerce.user_point point on user.idx = point.user_id
        where
            review.is_best = 1 and
            review.created_at between '${startDate}' and '${endDate}'
        group by 
            id, month
    `;
        console.log(query);
        const [rows, fields] = await connection.query(query);
        return rows as RowDataPacket[];
    }

    async selectUsersWithExpiringPoints(expiryDate: string): Promise<RowDataPacket[]> {
        const connection = await this.connect();
        const query: string = `
        select 
            user.idx as user_id,
            user.name as first_name,
            '' as last_name,
            user.phone_number as phone_number,
            user.email as email_address,
            user.email_allow as email_allow,
            user.sms_allow as sms_allow,
            user.push_allow as push_allow,
            user.nightly_push_allow as nighttime_notification_consent,
            user.marketing_push_allow as marketing_notification_consent,
            '' as nickname,
            sum(point.point_total) as points,
            min(point.expire_at) as expiry_date
        from
            commerce.user user
            inner join commerce.user_point point on user.idx = point.user_id
        where
            point.expire_at between '${expiryDate} 00:00:00' and '${expiryDate} 23:59:59'
        group by 
            id
    `;
        console.log(query);
        const [rows, fields] = await connection.query(query);
        return rows as RowDataPacket[];
    }

    async selectUsersWithExpiringCoupons(expiryDate: string): Promise<RowDataPacket[]> {
        const connection = await this.connect();
        const query: string = `
        select 
            user.idx as user_id,
            user.name as first_name,
            '' as last_name,
            user.phone_number as phone_number,
            user.email as email_address,
            user.email_allow as email_allow,
            user.sms_allow as sms_allow,
            user.push_allow as push_allow,
            user.nightly_push_allow as nighttime_notification_consent,
            user.marketing_push_allow as marketing_notification_consent,
            '' as nickname,
            user_coupon.expire_at as expiry_date
        from 
            commerce.user user
            inner join commerce.user_coupon user_coupon on user.idx = user_coupon.user_id
        where 
            user_coupon.is_used = 0 and
            user_coupon.expire_at between '${expiryDate} 00:00:00' and '${expiryDate} 23:59:59'
    `;
        console.log(query);
        const [rows, fields] = await connection.query(query);
        return rows as RowDataPacket[];
    }

    async selectTestUsers(): Promise<RowDataPacket[]> {
        const connection = await this.connect();
        const query: string = `
        select 
            user.idx as user_id,
            user.name as first_name,
            '' as last_name,
            user.phone_number as phone_number,
            user.email as email_address,
            user.email_allow as email_allow,
            user.sms_allow as sms_allow,
            user.push_allow as push_allow,
            user.nightly_push_allow as nighttime_notification_consent,
            user.marketing_push_allow as marketing_notification_consent,
            '' as nickname
        from
            commerce.user user
        where 
            idx in (19461, 21798242)
    `;
        console.log(query);
        const [rows, fields] = await connection.query(query);
        return rows as RowDataPacket[];
    }
}
