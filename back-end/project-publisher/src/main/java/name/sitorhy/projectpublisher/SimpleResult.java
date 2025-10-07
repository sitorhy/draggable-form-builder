package name.sitorhy.projectpublisher;

import lombok.Getter;
import lombok.Setter;

public class SimpleResult {
    @Getter
    @Setter
    boolean success;

    @Getter
    @Setter
    String message;

    public SimpleResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
