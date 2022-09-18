<br />

1. 초기 세팅 참고 블로그

<https://velog.io/@qhgus/Node-Express-TypeScript-%ED%99%98%EA%B2%BD-%EC%84%B8%ED%8C%85>

2. cross env 사용
<https://developpaper.com/question/what-if-cross-env-doesnt-work/>



3. ec2 인스턴스 생성
> 인스턴스 골라서 생성
> 신규 키 페어 생성 후 다운로드
> cd ~ && mkdir ./.ssh && mv ~/Desktop/파일명.pem ./
> chmod 400 파일명.pem
> ssh -i "파일명.pem" ubuntu@퍼블릭 IPv4 DNS(인스턴스 상세에서 찾을 수 있다.) ("secondtry.pem")
> 보안 > 인바운드 규칙 수정 > HTTP, HTTPS, MYSQL, Custom(내가쓰는 포트)

4. ubuntu 세팅
> $ sudo apt update
> 최신 노드 설치1: $ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
> 최신 노드 설치2: $ sudo apt install nodejs
> yarn 설치: $ sudo npm install --global yarn
> git 설치: $ sudo apt install git
> pm2 설치: $ sudo npm install -g pm2
> 내 서버 clone: $ git clone 레포지토리 주소

5. ec2 배포 과정
> ec2 ubuntu에서 git clone을 받는다.
> github 세팅 > 데브세팅 > token 발급
> $ sudo git config --global credential.helper store
> pm2 status > pm2 stop > mp2 delete
> 프로젝트 폴더에서 $ sudo yarn install
> local과 똑같은 .env.development 와 .env.production을 ubuntu 내 경로에 설치한다.
> rm -rf ./dist로 빌드 파일을 지운다.
> build script를 통해서 ts를 js로 변경한다.
> ** 중요 ** dist 폴더 안에 .env.production을 만들어준다.
> pm2 start ./dist/src/app.js 를 실행한다.
> 터미널 종료 후에도 작동하는지 확인 

6. mysql 실행
> mysql.server start