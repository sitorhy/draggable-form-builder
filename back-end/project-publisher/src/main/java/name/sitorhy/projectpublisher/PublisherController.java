package name.sitorhy.projectpublisher;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.Job;
import com.offbytwo.jenkins.model.JobWithDetails;
import name.sitorhy.projectpublisher.model.JobBuildWebHookBody;
import name.sitorhy.projectpublisher.model.PipelineOverviewRoot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;
import reactor.util.Loggers;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.util.*;

@RestController
@RequestMapping("vue-build")
public class PublisherController {
    @Value("${template.job}")
    String templateJob;

    @Autowired
    PublisherService publisherService;

    @Autowired
    JenkinsServer jenkinsServer;

    @Autowired
    RedisTemplate redisTemplate;

    @Autowired
    RedisUtil redisUtil;
    @Autowired
    private JenkinsClient jenkinsClient;

    @PostMapping("/simple-build")
    public SimpleResult triggerSimpleBuild() {
        try {
            publisherService.triggerSimpleBuild();
            return new SimpleResult(true, "");
        } catch (Exception e) {
            return new SimpleResult(false, e.getMessage());
        }
    }

    @GetMapping("/console-text")
    public SimpleResult consoleText(@RequestParam("jobName") String jobName, @RequestParam("number") int number) {
        try {
            return new SimpleResult(true, publisherService.consoleText(jobName, number));
        } catch (Exception e) {
            return new SimpleResult(false, e.getMessage());
        }
    }

    @GetMapping(value = "/job-xml", produces = {"application/xml"})
    public String jobXml(@RequestParam("jobName") String jobName) throws IOException {
        return jenkinsServer.getJobXml(jobName);
    }

    @GetMapping(value = "/job-search")
    public List<Job> findJob(@RequestParam(value = "jobName", required = false) String jobName) throws IOException {
        Map<String, Job> jobs = jenkinsServer.getJobs();
        if (jobName != null && !jobName.isEmpty()) {
            return jobs.values().stream().filter(i -> i.getName().contains(jobName)).toList();
        }
        return jobs.values().stream().toList();
    }

    @PostMapping("/job-create/{jobName}")
    SimpleResult createJob(@PathVariable("jobName") String jobName) {
        try {
            String jobXml = this.jobXml(templateJob);
            jenkinsServer.createJob(jobName, jobXml);
            return new SimpleResult(true, "");
        } catch (IOException e) {
            return new SimpleResult(false, e.getMessage());
        }
    }

    @PostMapping("/job-delete/{jobName}")
    SimpleResult deleteJob(@PathVariable("jobName") String jobName) {
        try {
            jenkinsServer.deleteJob(jobName);
            return new SimpleResult(true, "");
        } catch (IOException e) {
            return new SimpleResult(false, e.getMessage());
        }
    }

    @GetMapping("/built-list")
    SimpleListResult<JobBuilt> builtList(@RequestParam("jobName") String jobName) throws URISyntaxException, IOException {
        JobWithDetails job = jenkinsServer.getJob(jobName);
        List<Build> list = job.getAllBuilds();
        return new SimpleListResult<>(true, "", list.stream().map(i -> {
            try {
                return new JobBuilt(i.details().getFullDisplayName(), i.getNumber());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }).toList());
    }

    @GetMapping("/redis-status")
    SimpleObjectResult<Object> redisStatus() {
        if (redisTemplate == null) {
            return new SimpleObjectResult<>(false, "redis not yet");
        }
        assert redisTemplate.getConnectionFactory() != null;
        var obj = redisTemplate.getConnectionFactory().getConnection().execute("info");
        return new SimpleObjectResult<>(true, obj);
    }

    @PostMapping("/job-build/{jobName}")
    SimpleResult buildJob(@PathVariable("jobName") String jobName, @RequestBody JobBuildWebHookBody body) {
        try {
            List<Job> jobs = this.findJob(jobName);
            if (jobs.isEmpty()) {
                throw new RuntimeException("job not created");
            }

            File tempFile = Files.createTempFile("project-",".json").toFile();
            Files.writeString(tempFile.toPath(), body.data);

            // 常规 /build 接口触发
            jenkinsServer.getJob(jobName).build(new HashMap<>(){{
                // uri too long
                // put("PROJECT_JSON_FILE_TEXT", Optional.ofNullable(body.data).orElse(""));

                put("jobName",  jobName);
                put("PROJECT_JSON_FILE_PATH", tempFile.getAbsolutePath());
            }});

            // 携带复杂参数 使用触发器构建
//
//            body.jobName = jobName;
//            body.data = "";
//            body.tempFilePath = tempFile.getAbsolutePath();
//            jenkinsClient.webHookTrigger(body);
            return new SimpleResult(true, "");
        } catch (Exception e) {
            return new SimpleResult(false, e.getMessage());
        }
    }

    @PostMapping("/job-status/{jobName}/{number}")
    PipelineOverviewRoot statusJob(@PathVariable("jobName") String jobName, @PathVariable("number") int num) {
        return publisherService.pipelineOverview(jobName, num);
    }

    @GetMapping("/build-list/{jobName}")
    SimpleObjectResult<List<BuildStatus>> getBuildList(@PathVariable("jobName") String jobName) {
        ListOperations opsForList = redisTemplate.opsForList();
        List<String> buildIds = opsForList.range(
                String.format("builds:list:%s", jobName),
                0,
                -1
        );

        // 根据ID批量获取详细信息
        HashOperations hashOps = redisTemplate.opsForHash();
        List<BuildStatus> builds = new ArrayList<>();

        for (String buildId : buildIds) {
            String detailKey = "build:details:" + buildId;

            Map<String, Object> details = hashOps.entries(detailKey);

            ObjectMapper objectMapper = new ObjectMapper();
            builds.add(objectMapper.convertValue(details, BuildStatus.class));
        }

        return new SimpleObjectResult<>(true, builds);
    }

    @PostMapping("/stage-update")
    void updateJobBuild(@RequestBody BuildStatus build) throws JsonProcessingException {
        Loggers.getLogger(this.getClass()).info(new ObjectMapper().writeValueAsString(build));

        String listKey = "builds:list:" + build.jobName;

        String buildId = build.jobName + "#" + build.buildNumber;

        String detailKey = "build:details:" + buildId;

        HashOperations<String, String, BuildStatus> hashOps = redisTemplate.opsForHash();

        hashOps.putAll(detailKey, new ObjectMapper().convertValue(build, Map.class));

        // ID 加入 List 头部 (LPUSH)
        if (redisTemplate.opsForList().indexOf(listKey, buildId) == null) {
            redisTemplate.opsForList().leftPush(listKey, buildId);
        }

        // (可选) 裁剪列表，只保留最新的 N 个记录
        redisTemplate.opsForList().trim(listKey, 0, 99);
    }
}
