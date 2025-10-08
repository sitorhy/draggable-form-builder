package name.sitorhy.projectpublisher;

import lombok.Getter;
import lombok.Setter;

public class JobBuilt {
    @Getter
    @Setter
    private String jobName;

    @Getter
    @Setter
    private int buildNumber;

    public JobBuilt(String jobName, int buildNumber) {
        this.jobName = jobName;
        this.buildNumber = buildNumber;
    }

    public JobBuilt() {}
}
