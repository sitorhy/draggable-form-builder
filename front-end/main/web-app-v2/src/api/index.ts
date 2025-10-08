import {
	Config,
	Service,
	RequestMapping,
	RequestConfig,
	Expect,
	GetMapping,
	RequestParam,
	PostMapping
} from 'axios-annotations';
import { useApiConfig } from './config.ts';

const { hostname, port, protocol } = useApiConfig();

const config = new Config({
	host: hostname,
	port: port,
	protocol: protocol,
	prefix: '',
	plugins: []
});

type Resp1 = {
	success: boolean;
	data: {
		jobName: string;
		buildNumber: string;
		stageStatus: string;
		stageName: string;
	}[];
};

type Resp2 = {
	success: boolean;
	message: string;
};

type Resp3 = {
	name: string;
	url: string;
	fullName: string;
}[];

@RequestConfig(config)
@RequestMapping('/vue-build')
export class BuildService extends Service {
	@GetMapping('/build-list/{jobName}')
	collectJobBuildList(jobName: string) {
		return Expect<Resp1>({
			jobName
		});
	}

	@GetMapping('/console-text')
	@RequestParam('jobName', true)
	@RequestParam('number', true)
	getConsoleText(jobName: string, number: number | string) {
		return Expect<Resp2>({
			jobName,
			number
		});
	}

	@PostMapping('/job-build/{jobName}')
	@RequestParam('jobName', true)
	buildJob(jobName: string) {
		return Expect<Resp2>({
			jobName
		});
	}

	@RequestMapping('/job-search', 'GET')
	@RequestParam('jobName', true)
	findJobs(jobName: string) {
		return Expect<Resp3>({
			jobName
		});
	}

	@PostMapping('/job-create/{jobName}')
	@RequestParam('jobName', true)
	createJob(jobName: string) {
		return Expect<Resp2>({
			jobName
		});
	}
}
