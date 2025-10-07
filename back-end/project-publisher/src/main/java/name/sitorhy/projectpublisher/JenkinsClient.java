package name.sitorhy.projectpublisher;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

// url: 指定 Jenkins 服务的根地址
// configuration: 使用自定义配置来添加认证头
@FeignClient(
        name = "jenkins-client",
        url = "${jenkins.server.url}", // 从 application.properties 读取
        configuration = JenkinsAuthConfiguration.class // 关键：注入认证拦截器
)
public interface JenkinsClient {

    // ----------------------------------------------------
    // 1. 触发无参数构建 (POST /job/JOB_NAME/build)
    // ----------------------------------------------------
    @PostMapping(path = "/job/{jobName}/build",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    void triggerSimpleBuild(@PathVariable("jobName") String jobName);


    // ----------------------------------------------------
    // 2. 触发参数化构建 (POST /job/JOB_NAME/buildWithParameters)
    //    参数通过 @RequestParam 映射为 URL 查询参数
    // ----------------------------------------------------
    @PostMapping(path = "/job/{jobName}/buildWithParameters")
    String triggerParameterizedBuild(
            @PathVariable("jobName") String jobName,
            // 参数名必须和 Jenkins Job 中定义的参数名一致
            @RequestParam("API_URL") String apiUrl,
            @RequestParam("BRANCH") String branchName
            // ... 更多参数
    );

    @GetMapping(path = "/job/{jobName}/{number}/consoleText")
    String consoleText(
            @PathVariable("jobName") String jobName,
            // 参数名必须和 Jenkins Job 中定义的参数名一致
            @PathVariable("number") Integer number
    );
}
