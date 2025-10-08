package name.sitorhy.projectpublisher;

import lombok.Getter;
import lombok.Setter;

public class BuildStatus {
    @Getter
    @Setter
    String jobName;

    @Getter
    @Setter
    String buildNumber;

    @Getter
    @Setter
    String stageStatus;

    @Getter
    @Setter
    String stageName;
}
