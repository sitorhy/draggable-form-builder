# 设计文档

## 后端发布的实现方案

后端子项目用于验证发布策略。
后端需要决定如何将存储的 JSON Schema 转换为最终用户看到的页面，不考虑 SSR 方案：

+ 方案一：客户端渲染 (CSR)
有大量动态数据的应用。后端仅作为一个数据 API 服务。前端代码（Vue/React 运行时库）向后端请求页面 Schema API，后端从数据库或缓存中取出 JSON Schema，并返回给前端。前端的运行时库根据 JSON Schema 在浏览器中动态构建 DOM 结构并渲染页面。

+ 方案二：静态网站生成 (SSG)
适用于内容固定页面，后端运行时仅提供静态文件。后端触发一个构建任务（例如调用 Node.js 脚本）。该任务从数据库获取 JSON Schema，生成完整的 HTML、CSS 和 JS 静态文件。生成的静态文件被推送到 CDN 或对象存储（如 AWS S3, 阿里云 OSS）。

## 主要问题

### 前端是否可能传递除 JSON Schema 外的文件数据
不可能，前端只能获取 Runtime 环境的数据，所有数据都是运行时生成，并且不能直接获取 CSS 等项目资源。所有外部资源全部放到 OSS，为模拟 OSS，前端 publicPath 资源各个引擎拷贝一份。（`/files/radios.json` 等）

### 容器管理
前端项目迭代需要重新打包，部署到 Nginx 上时指定新的版本号目录。
"engine.com/v1?pid=xxx","engine.com/v2?pid=xxx" 等，pid 为 JSON Schema 标识，如果把 JSON Schema 整合项目中打包，不需要携带标志参数。
还有一种是根据需求管理，部署时根据需求命名目录，忽略版本号，部署上去的就是最新的前端容器，这种方案可能需要配合 Git 的分支管理。

### 后端发布步骤
方案二可整合方案一，取决于前端实现，后端只需要考虑方案二场景。
+ 从 Git 拉取前端项目，项目地址查询单独一个服务或前端提供关键信息
+ 前端发送 JSON Schema 到 Controller，后端将 JSON Schema 数据塞进前端项目，执行 “npm build”
+ 将 “dist” 内容迁移到 nginx，dist 文件夹根据版本或需求命名即可

### 文件差异化
就是打包时需要覆盖前端项目某些文件。文件模板提供可以是前端或后端，通常是 .env.procution 等配置文件，为简化问题只考虑 JSON Schema 数据文件 project.json。
+ 在流水线中调用 Groovy API writeFile 进行文件写入，Java 负责内容提供（buildWithParameters）。

<br>

由于 Jenkins 服务器会限制 URI 大小 （通常在 2KB 到 8KB 之间）。当你使用 buildWithParameters 并将大段 JSON 放在查询字符串中时，就会触发这个限制，不论是使用 buildWithParameters 还是 Webhook。

解决方案是 Java 写入到临时文件，仅提供文件路径给流水线，流水线负责移动文件即可。

Java 服务创建临时文件有两个时间段，静态资源可以在项目拉取前创建，创建后直接把路径传入流水线，第二种是项目拉取后修改文件，需要流水线在 steps 中调用接口完成。

### 会话同步方案
Java 用 opsForHash 生成 id 和对象，把 id 传进 buildWithParameters，流水线回调时携带该 id ，Java 使用会话对象可进行文件内容缓存或参数记录等。

### 基于Git构建管理的构想
适用于前端项目根据需求管理容器，需要细分稳定版分支，稳定版分支在细分需求分支，需求分支可能还需要定期回归稳定版分支。
Git 项目设置中有个叫 [Webhooks](https://docs.github.com/zh/webhooks/about-webhooks) 的功能,。Jenkins 有个叫 Generic Webhook Trigger Plugin 的插件，插件的回调地址是 "http://xxx.com:8080/generic-webhook-trigger/invoke", 只要配置了差距的 Job 都会受到 Git 回调的项目代码推送信息，流水线需要根据请求体提取分支信息，项目信息等判断是否需要执行，实现推送代码立即构建。或者将 Hook 指定到具体服务，中间可以穿插构建审批等功能。

# 本子项目验证职能
不考虑容器管理或会话管理为非核心功能，仅验证文件替换和 Jenkins Remote 交互两项基础功能可行性，其中 Jenkins Remote 有不同的调用方案，使用 FeignClient 封装或使用 wrapper，使用 F12 控制台可以获取部分 Jenkins 的 API，这些 API 可以使用 FeignClient 封装。Jenkins Remote API 文档不完善，Job 的 XML 获取，Job 的创建、删除可以使用第三方的 wappper JAR。

```xml
 <dependency>
    <groupId>com.offbytwo.jenkins</groupId>
    <artifactId>jenkins-client</artifactId>
    <version>0.3.8</version>
</dependency>

<!-- jenkins wrapper 需要 -->
<dependency>
    <groupId>jakarta.xml.bind</groupId>
    <artifactId>jakarta.xml.bind-api</artifactId>
    <version>2.3.3</version>
</dependency>
```


# 部署文档

## 运行环境
Ubuntu 24.04.3 LTS

## SSH
商用镜像可忽略，没有就登陆不上。
```
sudo apt update && sudo apt upgrade

sudo apt install openssh-server

sudo systemctl status ssh

sudo apt install openssh-client
```
登陆
```
ssh username@address
```

## JDK
略，安装 Jdk 21，适配最新的 Jenkins。

## Jenkins
[官方文档](https://www.jenkins.io/doc/book/installing/linux/#debianubuntu)，注意命令行使用 Jenkins 运行和 systemd 注册服务运行的配置文件不一样。

## Nginx

[官方文档](https://nginx.org/en/linux_packages.html)，找到 Ubuntu 部分复制粘贴。
查看运行状态
```
sudo systemctl status nginx
```
运行
```
sudo systemctl start nginx
```
配置文件在 /etc/nginx/nginx.conf
```
cat /etc/nginx/nginx.conf
```
单独开个端口
```
touch /etc/nginx/conf.d/low-code.conf
```
```
server {
    listen       8000;
    server_name  localhost;

    location / {
        root   		~/webroot;
        index  		index.html index.htm;
    }
}


```

# redis
默认配置即可，本来想用来缓存文件信息和 Job 状态，实际上写文件用不上该功能。
前端容器使用 JSON Schema 一对一管理，每个 JSON Schema 输出一个容器，构建历史使用 Redis List + Hash 联合存储, List 存id，Hash 存详情，可以往详情扩展或塞进各种功能，把 id 传给流水线可关联构建历史（id 关联 JobName#Number），实际上没有实现该功能。
<br>
官方要各种联系方式才能下载，直接：
```
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl status redis-server
```
开机运行
```
sudo systemctl enable redis-server
```
配置文件地址 "/etc/redis/redis.conf"

修改地址监听， 全部
```
bind * -::*
```
或者
```
bind 127.0.0.1 172.17.0.1
```
保护模式关掉 允许 docker 访问
```
protected-mode no
```
# Docker

方便管理服务

```
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

```
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

```
sudo systemctl status docker
```

```
sudo systemctl start docker
```

~~编译（大概率卡JRE）~~
```
mvn clean package spring-boot:build-image -X
```

## 使用宿主网络调试
```
docker build -t ttt .
docker run -d --name test --network host ttt
```

## 安装 docker-compose
```
[下载](https://github.com/docker/compose/releases/download/v2.40.1/docker-compose-linux-x86_64)

chmod +x docker-compose-linux-x86_64

sudo mv docker-compose-linux-x86_64 /usr/local/bin/docker-compose
```
# Jenkins 配置

## Publish over SSH 插件
只有一台服务器，接到本地，也可以直接用 shell mv。
不同服务器上传文件用 SCP / SFTP。
<br>
全局设置 / SSH Servers，添加 127.0.0.1 用户，点击高级输入密码，点击 test configuation 验证。链接命名 local。


## NodeJs 插件
Tools 新建实例，名称 "nodejs 22.2.0"，版本 22.2.0， Global npm packages to install 填写 "pnpm"，其他默认。

## 后台运行
```shell
nohup java -jar project-publisher-0.0.1-SNAPSHOT.jar & > log.txt
```