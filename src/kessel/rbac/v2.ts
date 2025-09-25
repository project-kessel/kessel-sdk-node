import {OAuth2ClientCredentials} from "../auth";

const WORKSPACE_ENDPOINT = '/api/rbac/v2/workspaces/';

interface Workspace {
    id: string;
    name: string;
    type: string;
    description: string;
}

interface AuthRequest {
    configureRequest: (request: Request) => Promise<void>;
}

export const oauth2AuthRequest = (credentials: OAuth2ClientCredentials): AuthRequest => {
    return {
        configureRequest: async (request) => {
            const token = await credentials.getToken();
            request.headers.set('authorization', `Bearer ${token.accessToken}`);
        }
    }
}

const fetchWorkspace = async (rbacBaseEndpoint: string, orgId: string, workspaceType: string, auth?: AuthRequest): Promise<Workspace> => {
    if (rbacBaseEndpoint.endsWith('/')) {
        rbacBaseEndpoint = rbacBaseEndpoint.slice(0, -1);
    }

    const url = new URL(rbacBaseEndpoint + WORKSPACE_ENDPOINT);
    url.searchParams.set('type', workspaceType);

    const request = new Request(url, {
        method: 'GET',
        headers: {
            'x-rh-rbac-org-id': orgId
        }
    });

    if (auth) {
        await auth.configureRequest(request);
    }

    const response = await fetch(request);

    if (response.status !== 200) {
        throw new Error(`Error while fetching the workspace of type ${workspaceType}. Call returned status code ${response.status}`);
    }

    const body = await response.json();

    if (body?.data?.length !== 1) {
        throw new Error(`unexpected number of ${workspaceType} workspaces: ${body?.data?.length}`);
    }

    return body.data[0];
}

export const fetchDefaultWorkspace = async (rbacBaseEndpoint: string, orgId: string, auth?: AuthRequest) => {
    return fetchWorkspace(rbacBaseEndpoint, orgId, 'default', auth);
}

export const fetchRootWorkspace = async (rbacBaseEndpoint: string, orgId: string, auth?: AuthRequest) => {
    return fetchWorkspace(rbacBaseEndpoint, orgId, 'root', auth);
}
