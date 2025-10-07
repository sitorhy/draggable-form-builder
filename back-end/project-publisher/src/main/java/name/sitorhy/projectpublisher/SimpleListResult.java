package name.sitorhy.projectpublisher;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class SimpleListResult<T> {
    @Getter
    @Setter
    boolean success;

    @Getter
    @Setter
    String message;

    @Getter
    @Setter
    List<T> results;

    public SimpleListResult() {}

    public SimpleListResult(boolean success, String message, List<T> results) {
        this.success = success;
        this.message = message;
        this.results = results;
    }
}
