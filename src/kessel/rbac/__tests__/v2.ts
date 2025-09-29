import { fetchDefaultWorkspace, fetchRootWorkspace } from "../v2";
import { AuthRequest } from "../../auth";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("RBAC workspace fetching", () => {
  const baseEndpoint = "https://api.example.com";
  const orgId = "test-org-123";

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe("fetchDefaultWorkspace", () => {
    it("fetches default workspace successfully", async () => {
      const mockWorkspace = {
        id: "workspace-123",
        name: "Default Workspace",
        type: "default",
        description: "Organization default workspace",
      };

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [mockWorkspace],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchDefaultWorkspace(baseEndpoint, orgId);

      expect(result).toEqual(mockWorkspace);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const capturedRequest = mockFetch.mock.calls[0][0];
      expect(capturedRequest.url).toBe(
        `${baseEndpoint}/api/rbac/v2/workspaces/?type=default`,
      );
      expect(capturedRequest.method).toBe("GET");
      expect(capturedRequest.headers.get("x-rh-rbac-org-id")).toBe(orgId);
    });

    it("uses authentication when provided", async () => {
      const mockWorkspace = {
        id: "workspace-456",
        name: "Default Workspace",
        type: "default",
        description: "Organization default workspace",
      };

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [mockWorkspace],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const mockAuth: AuthRequest = {
        configureRequest: jest.fn().mockImplementation(async (request) => {
          request.headers.set("authorization", "Bearer test-token");
        }),
      };

      const result = await fetchDefaultWorkspace(baseEndpoint, orgId, mockAuth);

      expect(result).toEqual(mockWorkspace);
      expect(mockAuth.configureRequest).toHaveBeenCalled();

      const capturedRequest = mockFetch.mock.calls[0][0];
      expect(capturedRequest.headers.get("authorization")).toBe(
        "Bearer test-token",
      );
    });

    it("handles trailing slash in endpoint", async () => {
      const mockWorkspace = {
        id: "workspace-789",
        name: "Default Workspace",
        type: "default",
        description: "Organization default workspace",
      };

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [mockWorkspace],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const endpointWithSlash = "https://api.example.com/";
      const result = await fetchDefaultWorkspace(endpointWithSlash, orgId);

      expect(result).toEqual(mockWorkspace);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const capturedRequest = mockFetch.mock.calls[0][0];
      expect(capturedRequest.url).toBe(
        `${baseEndpoint}/api/rbac/v2/workspaces/?type=default`,
      );
    });

    it("throws error on non-200 status", async () => {
      const mockResponse = {
        status: 404,
        json: jest.fn(),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchDefaultWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "Error while fetching the workspace of type default. Call returned status code 404",
      );
    });

    it("throws error when no workspaces found", async () => {
      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchDefaultWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "unexpected number of default workspaces: 0",
      );
    });

    it("throws error when multiple workspaces found", async () => {
      const mockWorkspaces = [
        {
          id: "workspace-1",
          name: "Default Workspace 1",
          type: "default",
          description: "First default workspace",
        },
        {
          id: "workspace-2",
          name: "Default Workspace 2",
          type: "default",
          description: "Second default workspace",
        },
      ];

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: mockWorkspaces,
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchDefaultWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "unexpected number of default workspaces: 2",
      );
    });

    it("handles network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockFetch.mockRejectedValue(networkError);

      await expect(fetchDefaultWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "Network connection failed",
      );
    });

    it("handles malformed response body", async () => {
      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: null,
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchDefaultWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "unexpected number of default workspaces: undefined",
      );
    });
  });

  describe("fetchRootWorkspace", () => {
    it("fetches root workspace successfully", async () => {
      const mockWorkspace = {
        id: "root-workspace-123",
        name: "Root Workspace",
        type: "root",
        description: "Organization root workspace",
      };

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [mockWorkspace],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchRootWorkspace(baseEndpoint, orgId);

      expect(result).toEqual(mockWorkspace);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const capturedRequest = mockFetch.mock.calls[0][0];
      expect(capturedRequest.url).toBe(
        `${baseEndpoint}/api/rbac/v2/workspaces/?type=root`,
      );
      expect(capturedRequest.method).toBe("GET");
      expect(capturedRequest.headers.get("x-rh-rbac-org-id")).toBe(orgId);
    });

    it("uses authentication when provided", async () => {
      const mockWorkspace = {
        id: "root-workspace-456",
        name: "Root Workspace",
        type: "root",
        description: "Organization root workspace",
      };

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [mockWorkspace],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const mockAuth: AuthRequest = {
        configureRequest: jest.fn().mockImplementation(async (request) => {
          request.headers.set("authorization", "Bearer root-token");
        }),
      };

      const result = await fetchRootWorkspace(baseEndpoint, orgId, mockAuth);

      expect(result).toEqual(mockWorkspace);
      expect(mockAuth.configureRequest).toHaveBeenCalled();

      const capturedRequest = mockFetch.mock.calls[0][0];
      expect(capturedRequest.headers.get("authorization")).toBe(
        "Bearer root-token",
      );
    });

    it("throws error on server error", async () => {
      const mockResponse = {
        status: 500,
        json: jest.fn(),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchRootWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "Error while fetching the workspace of type root. Call returned status code 500",
      );
    });

    it("throws error when no root workspaces found", async () => {
      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchRootWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "unexpected number of root workspaces: 0",
      );
    });

    it("throws error when multiple root workspaces found", async () => {
      const mockWorkspaces = [
        {
          id: "root-workspace-1",
          name: "Root Workspace 1",
          type: "root",
          description: "First root workspace",
        },
        {
          id: "root-workspace-2",
          name: "Root Workspace 2",
          type: "root",
          description: "Second root workspace",
        },
      ];

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: mockWorkspaces,
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchRootWorkspace(baseEndpoint, orgId)).rejects.toThrow(
        "unexpected number of root workspaces: 2",
      );
    });
  });

  describe("integration tests", () => {
    it("works with oauth2AuthRequest", async () => {
      const mockWorkspace = {
        id: "integration-workspace",
        name: "Integration Workspace",
        type: "default",
        description: "Integration test workspace",
      };

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({
          data: [mockWorkspace],
        }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Mock an AuthRequest that simulates oauth2AuthRequest behavior
      const mockAuth: AuthRequest = {
        configureRequest: jest.fn().mockImplementation(async (request) => {
          // Simulate OAuth token retrieval and setting
          request.headers.set(
            "authorization",
            "Bearer oauth-integration-token",
          );
        }),
      };

      const result = await fetchDefaultWorkspace(baseEndpoint, orgId, mockAuth);

      expect(result).toEqual(mockWorkspace);
      expect(mockAuth.configureRequest).toHaveBeenCalled();

      const capturedRequest = mockFetch.mock.calls[0][0];
      expect(capturedRequest.headers.get("authorization")).toBe(
        "Bearer oauth-integration-token",
      );
      expect(capturedRequest.headers.get("x-rh-rbac-org-id")).toBe(orgId);
    });

    it("handles auth configuration errors", async () => {
      const authError = new Error("Authentication failed");
      const mockAuth: AuthRequest = {
        configureRequest: jest.fn().mockRejectedValue(authError),
      };

      await expect(
        fetchDefaultWorkspace(baseEndpoint, orgId, mockAuth),
      ).rejects.toThrow("Authentication failed");

      expect(mockAuth.configureRequest).toHaveBeenCalled();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
