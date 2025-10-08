package name.sitorhy.projectpublisher;

import lombok.Getter;
import lombok.Setter;

public class SimpleObjectResult<T> {
    @Getter
    @Setter
    boolean success;

    @Getter
    @Setter
    T data;

    public SimpleObjectResult(boolean success, T data) {
        this.success = success;
        this.data = data;
    }
}
