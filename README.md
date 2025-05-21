# Watchdog
[![Language](https://img.shields.io/badge/Language-Typescript-3178c6?style=for-the-badge&logo=typescript)][typescript]
[![GPL License](https://img.shields.io/badge/License-GPL--3.0-28a745?style=for-the-badge&logo=github)](LICENSE)
[![Repo Size](https://img.shields.io/github/languages/code-size/xCrypt0r/Watchdog?style=for-the-badge&label=SIZE&color=lightgrey&logo=github)](/../../)

🐶 **Watchdog** is a Dcinside image crawler that includes NSFW detection.

## 목차
- [소개](#소개)
- [설치](#설치)
- [사용법](#사용법)
- [저자](#저자)
- [라이선스](#라이선스)

## 소개
**Watchdog**은 Node.js를 사용하여 [디시인사이드](https://www.dcinside.com)에서 이미지를 크롤링하고   
[TensorFlow](https://github.com/tensorflow/tfjs) 기반 NSFW 모델을 통해 이미지의 NSFW 여부를 판단하고 분류하는 프로그램입니다.

![](https://i.imgur.com/cco1UO6.png)
![](https://i.imgur.com/x5Jnzs5.png)

## 설치
### 공통
1. 이 레포지토리를 다운로드합니다.
1. [Node.js][node.js]를 설치합니다.  
    - 호환되는 버전은 **20.x** 또는 **22.x**입니다.
        - 이외의 버전 설치 시 tensorflow의 의존성 문제로 제대로 동작하지 않습니다.
    - 다른 Node.js 버전을 사용 중일 경우 [.nvmrc](.nvmrc) 파일을 참고해 권장 버전을 사용할 수 있습니다.  
    [nvm](https://github.com/nvm-sh/nvm)을 설치하고 다음 명령어로 권장 버전을 사용합니다.   

        ```bash
        nvm install 22
        nvm use 22
        node -v
        ```
1. [.env.example](.env.example)을 `.env`로 변경합니다.
1. [targets.example.json](targets.example.json)을 `targets.json`으로 변경합니다.

### 로컬
#### Windows
1. [Python][python] **3.x** 버전을 설치합니다.
1. [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/ko/visual-cpp-build-tools)를 설치합니다. ([링크](https://rinkesh-patel.medium.com/easy-way-to-install-tensorflow-tfjs-node-in-windows-11-machine-158f049d9efa) 참고)
1. `npm install`을 입력하여 의존성을 설치합니다.
1. `npm start` 또는 `npm run pm2:start`를 입력하여 프로그램을 실행합니다.

#### Linux
⚠️ 설명 추가 예정

### 도커
1. [Docker][docker]를 설치합니다.
1. Docker Desktop의 설정에서 최대 메모리 사용량을 조정합니다.
    - 이 프로그램은 [ecosystem.config.js](ecosystem.config.js)의 설정에 따라 pm2 사용 시 최대 16GB까지 메모리를 사용할 수 있으므로, Docker 메모리 제한을 이 이상으로 설정하세요.
        - Windows에서 WSL 2기반 Docker Desktop을 사용하는 경우 `.wslconfig`로 메모리 제한을 설정하세요.

    ![](https://i.imgur.com/R7QZi2d.png)

1. `npm install`을 입력하여 의존성을 설치합니다.
1. 아래 두 가지 명령어 중 하나를 입력합니다.
    - `make up` / `npm run docker:up`(Windows): Docker Hub에 올려둔 빌드된 이미지를 내려받아 컨테이너를 실행합니다.
    - `make build` / `npm run docker:build`(Windows): 로컬 소스 코드를 기반으로 이미지를 빌드하고 실행합니다.

## 사용법
- 기본적으로 이미지는 레포지토리 하위의 archive 폴더 내에 저장됩니다.
    - 저장 위치는 [.env](.env.example)파일의 **LOCAL_ARCHIVE_DIR** 값을 수정하여 변경할 수 있습니다.
- [targets.json](targets.example.json)을 수정하여 크롤링 대상 갤러리를 추가하거나 삭제할 수 있습니다.
    - 대상 갤러리가 많아질수록 메모리 사용량이 높아집니다.
    - 대상 갤러리는 다음과 같은 형식으로 입력합니다.  

        ```json
        "갤러리 아이디": {
            "name": "갤러리 이름",
            "type": "갤러리 타입"
        }
        ```
        - 갤러리 아이디는 갤러리 URL에서 id=뒤에 나오는 부분입니다.   
        예를 들어 국내야구 갤러리 URL `https://gall.dcinside.com/board/lists?id=baseball_new11`에서 갤러리 아이디는 `baseball_new11`입니다.
        - 갤러리 타입은 메인: `main`, 마이너: `minor`, 미니: `mini`로 작성합니다.

## 저자
Watchdog © xCrypt0r  
Authored and maintained by xCrypt0r

> GitHub [**@xCrypt0r**][my github]   
> Discord [**@xcrypt0r**][my discord]

## 라이선스
이 프로젝트는 [**GNU 일반 공중 사용 허가서 버전 3.0 (GPLv3)**](LICENSE) 라이선스를 따릅니다.

[typescript]: https://www.typescriptlang.org
[node.js]: https://nodejs.org/ko
[python]: https://www.python.org/downloads
[docker]: https://docs.docker.com/get-started/get-docker
[my github]: https://github.com/xCrypt0r
[my discord]: https://discord.com/users/282821913968115713