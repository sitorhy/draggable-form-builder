package name.sitorhy.projectpublisher;

import com.offbytwo.jenkins.JenkinsServer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class JenkinsRestConfiguration {
    @Value("${jenkins.auth.username}")
    private String username;

    @Value("${jenkins.auth.token}")
    private String apiToken;

    @Value("${jenkins.server.url}")
    private String jenkinsUrl;

    @Bean
    @Lazy(value = true)
    public JenkinsServer jenkinsServer() throws URISyntaxException {
        return new JenkinsServer(new URI(jenkinsUrl), username, apiToken);
    }
}