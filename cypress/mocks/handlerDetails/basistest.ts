import { http, HttpResponse } from 'msw';

import basisTest from '../../fixtures/basistest-health.json';
import basisTestRun from '../../fixtures/basistest-run.json';

import { TEST_RUNNER_API_URL } from '../mockConfig';

export const basisHandlers = [
    http.post(
        `${TEST_RUNNER_API_URL}/test-runner/:orgName/health`,
        () => {
            return HttpResponse.json(basisTest);
        }
    ),
    http.post(
        `${TEST_RUNNER_API_URL}/test-runner/:orgName/run`,
        () => {
            return HttpResponse.json(basisTestRun);
        }
    ),
];
