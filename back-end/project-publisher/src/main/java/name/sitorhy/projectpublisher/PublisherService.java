package name.sitorhy.projectpublisher;

import name.sitorhy.projectpublisher.model.PipelineOverviewRoot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublisherService {
    JenkinsClient jenkinsClient;

    @Autowired
    public PublisherService(JenkinsClient jenkinsClient) {
        this.jenkinsClient = jenkinsClient;
    }

    public void triggerSimpleBuild() {
        String jobName = "test2"; // 你的 Jenkins Job 名称
        // 触发参数化构建
        jenkinsClient.triggerSimpleBuild(jobName);
    }

    public String consoleText(String jobName, int number) {
        // 触发参数化构建
        return jenkinsClient.consoleText(jobName, number);
    }

    public PipelineOverviewRoot pipelineOverview(String jobName, int number) {
        return jenkinsClient.pipelineOverview(jobName, number);
    }
}
