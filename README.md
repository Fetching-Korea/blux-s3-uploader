# blux-s3-uploader

## 개요

- 이 프로젝트는 블럭스 - 페칭 간 데이터 연동 중 유저 데이터 연동을 위함이다. 
> 노션 팀문서 > 개발 > 백엔드 문서 > Backend 의 Blux.ai 항목에 블럭스에서 제공받은 문서들이 있다. 이 문서들을 확인해 보면 연동 프로젝트의 히스토리 파악이 용이하다.
- blux-s3-uploader 는 연동 작업 중 유저 데이터 업로드, 알림톡 세그먼트 데이터 추출 두 가지 용도로 쓰인다.

## 실행

- 레포 클론 하고, ```npm install``` 합니다.
- 이후 프로젝트에 .env 파일을 만들고 노션에서 https://www.notion.so/fetching/FETCHING > 사이드바의 팀문서 > 개발 > 백엔드 문서 > 환경변수 로 가서 blux-s3-uploader 하위 스니펫을 위에서 만든 .env 파일에 복붙합니다.
- 이후 npm run 으로 돌릴 수 있는 커맨드들을 확인 후 돌리면 됩니다.

## 스키마 설명

- blux-s3-uploader 는 블럭스에 데이터를 업로드하거나 또는 어드민을 통해 업로드할 데이터를 추출하는 용도인데, 이 때 필요에 따라 다른 스키마의 데이터를 올려야 합니다.
- 현재 구현되어 있는 스키마는 다음과 같습니다.
1. users: 블럭스에서 제공하는 외부 s3 버킷에 올리는 유저 데이터. 노션 팀문서 > 개발 > 백엔드 문서 > Backend 의 Blux.ai 항목 하위의 [페칭XBlux_유저데이터_연동_안내문서(S3_Cross_Account_Access).pdf] 를 확인해보면 히스토리를 파악할 수 있다. 하루에 한 번 돌리고 다운 받은 데이터 확인하면 됩니다.
2. users-with-best-reviews: https://console.crm.blux.ai/segments 의 베스트 리뷰 세그먼트에 활용되는 스키마. 송희님께서 요청하실 때 드리면 됩니다.
3. users-with-expiring-points: https://console.crm.blux.ai/segments 의 적립금 만기 세그먼트에 활용되는 스키마. 송희님께서 요청하실 때 드리면 됩니다.
4. users-with-expiring-coupons: https://console.crm.blux.ai/segments 의 쿠폰 만기 세그먼트에 활용되는 스키마. 송희님께서 요청하실 때 드리면 됩니다.
5. test-users: https://console.crm.blux.ai/segments 의 테스트용 세그먼트에 활용되는 스키마. 송희님께서 요청하실 때 드리면 됩니다.

