package name.sitorhy.projectpublisher;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.Base64;

@Configuration
public class JenkinsAuthConfiguration implements RequestInterceptor {

    // 从配置文件读取 Jenkins 用户名和 Token
    @Value("${jenkins.auth.username}")
    private String username;

    @Value("${jenkins.auth.token}")
    private String apiToken;

    @Value("${jenkins.server.url}")
    private String jenkinsUrl;

    @Override
    public void apply(RequestTemplate template) {
        // 1. 构建认证字符串: username:token
        String auth = username + ":" + apiToken;

        // 2. Base64 编码
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

        // 3. 将认证头添加到 Feign 请求模板中
        template.header("Authorization", "Basic " + encodedAuth);

        // 由于 Jenkins POST 请求体为空，且不需要特定的内容类型，这里可以省略 Content-Type
        // template.header("Content-Type", "application/json");
    }
}