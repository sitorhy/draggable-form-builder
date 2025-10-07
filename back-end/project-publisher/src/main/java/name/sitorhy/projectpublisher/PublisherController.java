package name.sitorhy.projectpublisher;

import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.Job;
import com.offbytwo.jenkins.model.JobWithDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("vue-build")
public class PublisherController {
    @Autowired
    PublisherService publisherService;

    @Autowired
    JenkinsServer jenkinsServer;

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
    SimpleResult createJob(@PathVariable("jobName") String jobName, @RequestBody String jobXml) {
        try {
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
}
