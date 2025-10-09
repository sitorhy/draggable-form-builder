package name.sitorhy.projectpublisher.model;

public class JobBuildWebHookBody {
    public String data;
    public String jobName;
    public String tempFilePath; // 预先存为临时文件 不使用 data 字段
}
