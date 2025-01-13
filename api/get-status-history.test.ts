/**
 * @jest-environment @dynatrace/runtime-simulator/lib/test-environment
 */

const fetchMock = jest.fn();
globalThis.fetch = fetchMock;

import getStatusHistory from "./get-status-history";

describe("get-status-history", () => {
  const mockData = [
    { status: "disruption", active: true },
    { status: "partial-disruption", active: false },
    { status: "operational", active: true },
  ];

  const expectedResults = [
    {
      status: "disruption",
      active: true,
      color: "critical",
      description: "Service disruption",
    },
    {
      status: "partial-disruption",
      active: false,
      color: "warning",
      description: "Partial service disruption",
    },
    {
      status: "operational",
      active: true,
      color: "success",
      description: "Operational",
    },
  ];

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should return data correctly", async () => {
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await getStatusHistory();

    expect(fetch).toHaveBeenCalledWith("https://dt-url.net/status-history");
    expect(result).toEqual(expectedResults);
  });

  it("should filter data by active status", async () => {
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await getStatusHistory({ active: true });

    expect(fetch).toHaveBeenCalledWith("https://dt-url.net/status-history");
    expect(result).toEqual([
      {
        status: "disruption",
        active: true,
        color: "critical",
        description: "Service disruption",
      },
      {
        status: "operational",
        active: true,
        color: "success",
        description: "Operational",
      },
    ]);
  });

  it("should handle an empty response", async () => {
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([]),
    });

    const result = await getStatusHistory();

    expect(fetch).toHaveBeenCalledWith("https://dt-url.net/status-history");
    expect(result).toEqual([]);
  });
});
