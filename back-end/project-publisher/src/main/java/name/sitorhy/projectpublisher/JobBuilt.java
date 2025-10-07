package name.sitorhy.projectpublisher;

import lombok.Getter;
import lombok.Setter;

public class JobBuilt {
    @Getter
    @Setter
    private String jobName;

    @Getter
    @Setter
    private int number;

    public JobBuilt(String jobName, int number) {
        this.jobName = jobName;
        this.number = number;
    }

    public JobBuilt() {}
}
