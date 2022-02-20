<br />
1. 초기 세팅 참고 블로그

<https://velog.io/@qhgus/Node-Express-TypeScript-%ED%99%98%EA%B2%BD-%EC%84%B8%ED%8C%85>

2. cross env 사용
<https://developpaper.com/question/what-if-cross-env-doesnt-work/>

3. ec2 배포 과정
> ec2 ubuntu에서 git clone을 받는다.
> local과 똑같은 .env.development 와 .env.production을 ubuntu 내 경로에 설치한다.
> build script를 통해서 ts를 js로 변경한다.
> ** 중요 ** dist 폴더 안에 .env.production을 만들어준다.
> pm2 start ./dist/src/app.js 를 실행한다.


4. ubuntu 실행
> cd ~/.ssh
> ssh -i "testapp.pem" ubuntu@ec2-3-37-36-254.ap-northeast-2.compute.amazonaws.com