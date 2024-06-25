import {OptionValues, program} from 'commander';
import { version } from '../package.json'
import FileMaker from "./filemaker";
import S3Uploader from "./s3uploader";

program.version(version);
program.option('-d, --debug', 'Debug mode - upload to fetching test bucket');
program.option('-l, --local', 'Local mode - don\'t upload files at all and only save the files locally');
program.option('-s, --schema <schemaName>', 'schema name: users | users-with-best-reviews | users-with-expiring-points | users-with-expiring-coupons | test-users')
program.option('--expiry-date <expiryDate>', 'expiry date: only applies for schemas users-with-expiring-points, users-with-expiring-coupons. uses yyyy-MM-dd format')
program.option('-c, --chunkSize <chunkSize>', 'chunk size');
program.parse(process.argv);
const options: OptionValues = program.opts();

class App {

    fileMaker = new FileMaker();
    uploader = new S3Uploader();

    async main() {
        const isDebug: boolean = (options.debug);
        const isLocal: boolean = (options.local);
        const targetBucket = isDebug ? 'fetching-test' : 'blux-external';
        const schema: string = (options.schema);
        const expiryDate: string = (options.expiryDate);
        const chunkSize: number = Number(options.chunkSize);
        await this.writeDataToFileAccordingToSchema(schema, chunkSize, expiryDate);
        if (!isLocal) {
            await this.uploader.upload('./files/users.csv', targetBucket, 'fa71ae1a/users/catalog.csv');
        }
        // 블럭스 유저 업로드인 경우 다운로드 해서 로컬에서 파일 확인
        if (schema === 'users' && !isDebug && !isLocal) {
            await this.uploader.download();
        }
        return;
    }

    async makeDataAccordingToSchema(schema: string, chunkSize?: number, expiryDate?: string): Promise<Object[]> {
        let data: Object[] = [];
        switch (schema) {
            case 'users':
                data = await this.fileMaker.makeUsersData(chunkSize);
                break;
            case 'users-with-best-reviews':
                data = await this.fileMaker.makeUsersWithBestReviewsData('2024-01-01 00:00:00', '2024-12-31 23:59:59');
                break;
            case 'users-with-expiring-points':
                if (!expiryDate) throw Error('--expiry-date arg is required when using the users-with-expiring-points schema');
                data = await this.fileMaker.makeUsersWithExpiringPointsData(expiryDate);
                break;
            case 'users-with-expiring-coupons':
                if (!expiryDate) throw Error('--expiry-date arg is required when using the users-with-expiring-coupons schema');
                data = await this.fileMaker.makeUsersWithExpiringCouponsData(expiryDate);
                break;
            case 'test-users':
                data = await this.fileMaker.makeTestUsersData();
                break;
            default:
                console.error('Unknown schema type: ' + schema);
                break;
        }
        return data
    }

    async writeDataToFileAccordingToSchema(schema: string, chunkSize: number, expiryDate?: string): Promise<void> {
        const data: Object[] = await this.makeDataAccordingToSchema(schema, chunkSize, expiryDate);
        let pathPrefix: string = './files'
        switch (schema) {
            case 'users':
                await this.fileMaker.writeUsersAsCSV(`${pathPrefix}/${schema}.csv`, data);
                break;
            case 'users-with-best-reviews':
                await this.fileMaker.writeUsersWithBestReviewsAsCSV(`${pathPrefix}/${schema}.csv`, data);
                break;
            case 'users-with-expiring-points':
                await this.fileMaker.writeUsersWithExpiringPointsAsCSV(`${pathPrefix}/${schema}.csv`, data);
                break;
            case 'users-with-expiring-coupons':
                await this.fileMaker.writeUsersWithExpiringCouponsAsCSV(`${pathPrefix}/${schema}.csv`, data);
                break;
            case 'test-users':
                await this.fileMaker.writeTestUsersAsCSV(`${pathPrefix}/${schema}.csv`, data);
                break;
            default:
                console.error('Unknown schema type: ' + schema);
                break;
        }
    }
}


(new App()).main().then(()=> { console.log("finished") });
