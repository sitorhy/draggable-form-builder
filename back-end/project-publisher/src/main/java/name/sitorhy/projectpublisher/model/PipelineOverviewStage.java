package name.sitorhy.projectpublisher.model;

import java.util.ArrayList;

public class PipelineOverviewStage {
    public String id;
    public String name;
    public String state;
    public String type;
    public String title;
    public int pauseDurationMillis;
    public Object startTimeMillis;
    public int totalDurationMillis;
    public ArrayList<Object> children;
    public boolean isSequential;
    public boolean synthetic;
    public boolean placeholder;
    public String agent;
    public String url;
}
