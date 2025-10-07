package name.sitorhy.projectpublisher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ProjectPublisherApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjectPublisherApplication.class, args);
    }
}
